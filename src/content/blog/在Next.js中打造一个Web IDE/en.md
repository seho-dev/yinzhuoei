---
title: "Building a Web IDE in Next.js"
description: "Introduction I recently needed to embed IDE functionality in Next.js and ran into a great many pitfalls along the way. If you have a similar requirement, trust me: after reading this article, you will not need to keep looking for other resources, because I will explain every implementation detail…"
date: 2022-10-30
lang: en
translationKey: "2022-10-30_786_在Next.js中打造一个Web IDE"
categories:
  - "Frontend"
views: 5407
draft: false
---

## Introduction

I recently needed to embed IDE functionality in Next.js, and I ran into a great many pitfalls along the way. If you have a similar requirement, trust me: after reading this article, you should not need to keep hunting for other resources. I will walk through every implementation detail.

## Preparation

Before getting started, let's establish the technical context. We need to embed the Monaco editor in Next.js (v12+). Beyond that, we want to take inspiration from CodeSandbox, the well-known online IDE, and support searching for, installing, and removing dependencies. Changes to those dependencies directly affect whether the editor can provide valid type hints—or show red squiggles instead.

- next.js
- monaco

### Requirements

- Search for dependencies and perform CRUD operations.
- Provide TypeScript type hints.
- Follow familiar desktop IDE workflows, including autosave and manual saving.
- Support fullscreen mode.
- Debug and run scripts, and display the output.

## Integrating Monaco into Next.js

Let's install and use `@monaco-editor/react` right away. Monaco is framework-agnostic, so some ready-made React components will help us build the IDE. Following the official documentation should get us up and running without errors. We can easily get a fully functional editor with TypeScript type hints:

```html
<Editor
   language={props.defaultLanguage ?? 'typescript'}
   defaultValue={props.defaultValue ?? '// some comment'}
   value={props.value}
/>
```

### Problems You May Encounter

Now for the catch. If you encounter CSS errors while using this React component, do not panic. First, check whether this is the error:

```js
CSS Modules cannot be imported from within node_modules
```

This happens because Monaco imports CSS internally from its components. Yes, the source has not been bundled at this point. That is not usually a problem in a conventional React or Vue application. In the Next.js development environment, however, its CSS architecture leaves it unsure how to handle CSS imported inside a dependency:

```js
import "./banner.css"
```

Next.js is left wondering: is this global CSS? If so, how should it order the global styles? If it is modular CSS, it cannot be certain which naming conventions it uses—lowercase, camelCase, and so on. Because of how Next.js is designed, this cannot be resolved as-is in the development environment, which does not bundle `node_modules`.

That leaves us with three options:

1. Precompile the packages in node_modules.
2. Ask the library author to change it. Hmph!
3. Change it ourselves. Sigh.

Let's rule out the second option first. We are not the first people to encounter this in Next.js. There are plenty of PRs and issues discussing Monaco's CSS; this is not something a single PR will solve.

Returning to the first option, fortunately there are excellent libraries that help us precompile dependencies. Here is a quick example using `next-transpile-modules`, configured according to its documentation:

```
// next.config.js

const withTM = require("next-transpile-modules")([
  "monaco-editor"
]);
```

List the packages to precompile in the array, then wrap and export the existing Next.js configuration:

```js
module.exports = withTM({
    ...
});
```

If you still see a pile of errors at this point, you are in luck: we can use the third option and fork the repositories ourselves. All we need to do is remove the lowest-level CSS imports. That sounds simple, but it touches a lot of code, and to keep `@monaco-editor/react` working, we need to compile each package in its dependency chain. It is a fair amount of work. In the next section, I will outline the packages that need compiling and list my modified packages up front so you can install them directly and skip the source changes.

## Modifying VS Code's Underlying Core and the Related React Libraries

Using `monaco`, or components built on top of it, can trigger errors in Next.js. Compiling the underlying libraries takes a long time. Before listing the precompiled dependencies, I should also introduce a Monaco plugin we will use later: `monaco-editor-auto-typings`, which automatically imports TypeScript types. It is included in the source changes too.

```json
{
"dependencies": {
   "@swordjs/monaco-editor": "*",
   "@swordjs/monaco-editor-auto-typings": "*",
   "@swordjs/monaco-editor-react": "*",
   "@swordjs/monaco-editor-webpack-plugin": "^7.0.1",
 }
}
```

If you just need to get rid of the errors quickly, install the packages you need from this list and skip to the next section.

### Details of the Changes

Once we know why Next.js is reporting the error, the fix is straightforward. Go directly to `monaco-core`, in the VS Code GitHub repository, and find [code like this](https://github.com/microsoft/vscode/blob/f195c00f1e471b14778012b020472ce88484c8af/src/vs/base/browser/ui/actionbar/actionbar.ts#L15):

![WX20221018-161133@2x.png](http://static.yinzhuoei.com/typecho/2022/10/18/807061554729849/WX20221018-161133@2x.png)

Comment out all similar CSS imports throughout the repository—there are a few dozen—then build the modified source. You may be wondering whether changing VS Code's browser styles will break the styling in our application.

The answer is no.

We are using a wrapper library around Monaco, and that wrapper uses a CDN internally: [jsDelivr](https://www.jsdelivr.com/). Those assets are not subject to Next.js's restrictions because they are not in `node_modules`. The reason we must go to all this trouble to rebuild several libraries is that:

1. Dependencies are nested inside other dependencies.
2. Any offending import inside node_modules can trigger the error.

If you do not want to load the library from a CDN, you can download the original VS Code source from GitHub into `public` and explicitly configure the loader to use it. This avoids the errors while preserving the correct VS Code styling:

```js
// Create a modules folder under public
import { loader } from '@swordjs/monaco-editor-react';
loader.config({ paths: { vs: '/modules/monaco-editor/min/vs' } });
```

Once the core has been modified, the remaining work on `monaco-editor` and `monaco-editor-react` is mainly a matter of understanding how to build each library. Some can be built with a single command. For the core library, however, we need to examine its CI workflow to determine the correct build process. Fortunately, the build pipelines maintained by large companies are mature. Once I found the right approach, the builds completed without failures.

At this point, we have worked through the source and dependencies layer by layer and rebuilt the entire `monaco` family.

## Implementing the Web IDE Component

We have finally reached the heart of the project: the IDE component. This section implements most of its features and briefly explains how debugging works behind the scenes. On the frontend, I will package the IDE as a reusable component. The backend support uses Go and Node.js to compile and execute our TypeScript scripts, then return the results to the frontend for display.

### Breaking Down the IDE's Features

We can divide the IDE into several important parts:

- The header component provides the manual save button and displays the save status.
- The action component handles input parameters, debugging and execution, and displaying results.
- The code component is the editor itself, where we configure most of Monaco's options.
- The depend-list component displays the script's dependencies and lets us manage them externally through CRUD operations.
- The index component is the public entry point. It contains much of the core logic, including callbacks and business logic for all its children.

For this project, a `path` variable identifies which script the backend should return. We need more than the script itself: we also need its dependencies, whether it is enabled, and, most importantly, its debugging parameters. We will store all this information in `hookInfo`.

```js
export type Depend = { [key: string]: string }
export type Input = { [key: string]: any }
export type HookInfo = {
       script: string,
       scriptType: string,
       type: string,
       path: string,
       depend: Depend[] | null,
       input: Input | null,
       switch: boolean
};

const [hookInfo, setHookInfo] = useState<HookInfo>();
```

### Saving Code

At its core, saving code means retrieving the script's contents, sending them through an API, and having the backend write them to a file. Almost every web IDE tries to reproduce the workflows of a desktop IDE: Ctrl+S, automatic uploads, and manual saving. We can divide the saving logic into two categories:

- Active: manual saving.
- Passive: automatic saving.

The save status can be one of the following:

- Latest code loaded, when first opening the IDE.
- Editing.
- Saving.
- Saved.

For `passive saving`—autosave—`editing` means that the user has typed something different from the previous code. After editing stops for a `specified interval (1,000 ms)`, the status becomes `saving`. Once the save succeeds, it becomes `saved`.

We can express these with two definitions:

```ts
// 4 save states
export enum AutoSaveStatus {
  LOADED = 'loaded',
  SAVEING = 'saveing',
  SAVED = 'saved',
  EDIT = 'edit'
}

// Save payload type
export type AutoSavePayload = {
  // Active or passive
  type: 'active' | 'passive',
  // Save status
  status: AutoSaveStatus | null
}
```

First, we need to register the save event once Monaco is ready, so we define two state variables:

```js
const [editor, setEditor] = useState<any>();
const [monaco, setMonaco] = useState<any>();
```

Set both variables in the monaco-react component's `onMount` callback:

```js
const handleEditorMount: OnMount = (monacoEditor, monaco) => {
    setEditor(monacoEditor)
    setMonaco(monaco)
}
```

Next, define state for the save payload using the `AutoSavePayload` type from above:

```js
const [savePayload, setPayload] = useState<AutoSavePayload>({
  type: 'passive',
  status: null
});
```

Register a Ctrl+S callback by listening for keyboard events:

```js
useEffect(() => {
    // Listen for ctrl+s keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        // Save manually
        handleSave('active')
        e.preventDefault();
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [editor, monaco])
```

In `handleSave`, we need to check the current save status and debounce the operation:

```js
const handleSave = useCallback(debounce((type: AutoSavePayload['type'] = 'passive') => {
    // Skip duplicate saves while saving
    if (savePayload.status === AutoSaveStatus.SAVEING) {
      return
    }
    setPayload({
      type,
      status: AutoSaveStatus.SAVEING
    })
    // Save the script contents, call the api
    void saveHookScript(props.hookPath, editor.getValue()).then(() => {
      setPayload({
        type,
        status: AutoSaveStatus.SAVED
      })
    })
  }, 1000), [editor])
```

That completes `saving with Ctrl+S`. Next, let's implement passive saving, or autosave. As the name suggests, we need to listen for changes to the editor's contents. The `monaco-react` component already provides a callback for this. First, though, let's clarify its `value` and `defaultValue` props.

`defaultValue` is straightforward: it supplies an initial code snippet. The editor maintains its own internal variable for the code, and this prop initializes that variable. Alternatively, passing a `value` prop makes the contents fully controlled by us.

Where does the script's value come from? From the API, of course. Remember `hookInfo ` from earlier? After calling the API, set the save payload's status to `LOADED` and assign the returned data to `hookInfo`:

```js
useEffect(() => {
    void getHook<HookInfo>(props.hookPath).then(data => {
      // Update payload
      setPayload({
        type: 'passive',
        status: AutoSaveStatus.LOADED
      })
      setHookInfo(data);
    })
  }, [])
```

Pass `value` to the editor component to control its contents, and forward changes through an `onChange` prop callback. The parent component will handle the autosave logic.

```html
<Editor
    // other options
    value={hookInfo.script}
    onChange={(value) => {
        if (props.onChange) {
           props.onChange(value)
        }
    }}
/>
```

Define a dedicated handler for the autosave logic triggered by `onChange`:

```js
const codeChange = (value?: string) => {
    if (hookInfo) {
     // Sync the script contents in hookInfo
      setHookInfo({
        ...hookInfo,
        script: value ?? ''
      })
    }
    if (![AutoSaveStatus.EDIT, AutoSaveStatus.SAVEING].includes(savePayload.status ?? AutoSaveStatus.LOADED)) {
        setPayload({
          type: 'passive',
          status: AutoSaveStatus.EDIT
        })
        saveTimer.current = setTimeout(() => {
          handleSave('passive')
        }, SAVE_DELAY);
    }
  }
```

This code checks the save status so that it does not schedule this logic again while already editing or saving. Those state checks are easy enough to follow. But should `codeChange` compare the new value with `script`, and what exactly is `saveTimer`?

Why keep `script` around? So we can compare the new value with the current script. If nothing has changed, there is no need to autosave. You might ask: if `onChange` fired, surely the code changed? Not necessarily. A user might quickly type `A` and then delete it. Callbacks fire, but that does not mean the final code differs from the original. Add this check as the first line of `codeChange`:

```js
if (hookInfo?.script === value) return;
```

What does `saveTimer` do? As discussed, saving can be `active` or `passive`. A passive save waits for `SAVE_DELAY` before calling the save API. During that delay, the user may save manually with `Ctrl+S`. When performing an active save, we therefore need to check whether `saveTimer` has a value and cancel the pending passive save.

```js
const handleSave = useCallback(debounce((type: AutoSavePayload['type'] = 'passive') => {
    // other
    if (type === 'active' && saveTimer.current) {
      clearTimeout(saveTimer.current)
      saveTimer.current = null
    }
    // Save next
  }, 1000), [editor])
```

Without this step, the IDE gets tangled up between `passive saves` and `active saves`, sending lots of unnecessary save requests.

### Fullscreen Mode

We want users to feel immersed while writing code in the IDE. Fullscreen support is very simple to implement. The IDE header has a `fullscreen icon`; all we need is state indicating `whether fullscreen is enabled`.

```js
// Whether fullscreen is enabled
const [fullScreen, setFullScreen] = useState(false)
```

Wrap the IDE component in a fullscreen plugin:

```js
import { FullScreen, useFullScreenHandle } from 'react-full-screen';

const handle = useFullScreenHandle();

<FullScreen handle={handle} onChange={(state) => {
   if (!state) {
    setFullScreen(false);
   }
 }}>

// ide component
</FullScreen>
```

Now pass the state to the header component, show the appropriate icon internally, and register a click handler to toggle fullscreen mode:

```js
<IdeHeaderContainer {...{
  // Other props
  fullScreen,
  onFullScreen: () => {
    setFullScreen(!fullScreen)
    handle.active ? void handle.exit() : void handle.enter()
  }
}} />
```

### Searching npm Packages

The fullscreen feature in the previous section was simple, and this section is too. We are hardly going to build a mirror of the npm registry just to support dependencies in our IDE. We only need a public npm API that we can query for packages. Here, we choose `unpkg`. We can write the following `service` code:

```js
import axios from 'axios'

const CDN = 'https://api.cdnjs.com/libraries'

export const getDependList = async (keys: string) => {
  type Return = Record<'results', { name: string; latest: string }[]>
  const data = await axios.get<any, { data: Return }>(`${CDN}?search=${keys}&limit=20`)
  // Format data as select label and value pairs
  return data.data.results.map(item => ({ label: item.name, value: item.name }))
}

export const getDependVersions = async (keys: string) => {
  const data = await axios.get<any, { data: { versions: string[], version: string } }>(`${CDN}/${keys}`)
    // Format data as select label and value pairs
    // Reverse and take the first 100 entries
    return {
      list: data.data.versions.reverse().slice(0, 100).map(item => ({ label: item, value: item })),
      latest: data.data.version
    }
}
```

One function fetches the list of packages; the other fetches the available versions of a package. Since this is asynchronous, we can request the version list as a `microtask`. For the frontend UI, we use an Ant Design search select with debouncing. It is easy to implement and is essentially the official Ant Design demo:

```js
export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>
    debounceTimeout?: number
}

function DebounceSelect<
    ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any
>({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false)
    const [options, setOptions] = useState<ValueType[]>([])
    const fetchRef = useRef(0)
    const selectRef = useRef(null)

    const debounceFetcher = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/require-await
        const loadOptions = async (value: string) => {
            fetchRef.current += 1
            setOptions([])
            setFetching(true)

            void fetchOptions(value).then(newOptions => {
                setOptions(newOptions)
                setFetching(false)
            })
        }

        return debounce(loadOptions, debounceTimeout)
    }, [fetchOptions, debounceTimeout])

    return (
        <Select
            labelInValue
            ref={selectRef}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            getPopupContainer={triggerNode => triggerNode.parentElement}
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
            onChange={(value, options) => {
                if (props.onChange && selectRef.current) {
                    // Call blur
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    (selectRef.current as any).blur()
                    props.onChange(value, options)
                }
            }}
            options={options}
        />
    )
}
```

We now have a reusable debounced search select, ready to use:

```js
<DebounceSelect
 mode="multiple"
 value={value}
 placeholder="Search dependencies"
 fetchOptions={getDependList}
 onChange={newValue => {
   if (Array.isArray(newValue) && newValue.length > 0) {
     addDepend(newValue[0].label)
   }
   setValue([])
 }}
/>
```

At this point, the component needs a variable to store the `dependency list`. Rather than a plain object, I want a structure that makes entries easy to retrieve and replace, with convenient APIs for manipulating the list. `Map` is a perfect fit.

```js
const [dependList, setDependList] = useState<Map<string, string | null>>(new Map([]))
```

The `key` is the package name, and the `value` is its version. I will explain below why `value` can also be `null`.

Having initialized the dependency list and called `onAddDepend`, let's look at how adding a dependency works:

```js
const addDepend = async (name: string) => {
     // Fetching versions is asynchronous, perform the async operation here
     void getVersions(name, dependList.size).then(res => {
         // Re-render, set version
         setDependList(prev => {
              const newDependList = new Map(prev)
              newDependList.set(name, res.latest)
              return newDependList
         })
      })
     // Default version to null, a null version means it is temporarily hidden
     dependList.set(name, null)
     setDependList(new Map([...dependList]))
}
```

There we go! When a user selects a dependency, we request its `versions`. In the synchronous code that runs before the response arrives, we set its version to `null`. This `null` represents an `intermediate state`: the version has not finished loading. We can use that state in the UI, for example by showing a loading icon so users know the version is being fetched.

What if, after the dependency loads, the user wants to switch versions? Do we have to fetch `versions` again? Of course not. We always write code with the noble goal of saving users' bandwidth (`I almost believe that myself`). A simple cache mapping package names to version lists will do.

```js
// Store version lists, use an object, key is the dependency name, value is the version list
const [versionList, setVersionList] = useState<{
 [key: string]: { label: string; value: string }[]
}>({})
```

That means `getVersions` should work like this:

```js
const getVersions = async (
     dependName: string,
     index: number
): Promise<{ versions: any; latest: string }> => {
  if (versionList[dependName]) {
    return { versions: versionList[dependName], latest: versionList[dependName][0].value }
  }
  const { list: versions, latest } = await getDependVersions(dependName)
  setVersionList(prev => ({ ...prev, [dependName]: versions }))
  return { versions, latest }
}
```

With `addDepend` complete, we need to support removing and updating dependencies in the IDE. Tools such as CodeSandbox provide small icons for dependency management, so we will take the same approach.

```js
// Remove a dependency
const removeDepend = (name: string) => {
   dependList.delete(name)
   props.onDependDelete?.(name)
   setDependList(new Map([...dependList]))
}

// Update a dependency
const updateDepend = (name: string, version: string) => {
   dependList.set(name, version)
   setDependList(new Map([...dependList]))
}
```

Updating a dependency is simple: just call `setDependList` again. Removing one requires an additional `prop callback`, because later on we will need special handling for deleted dependencies.

We can now put the dependency list in a `useEffect` dependency array and invoke the appropriate `prop callback` whenever it changes:

```js
useEffect(() => {
  const dependListObj: Depend = {};
  dependList.forEach((value, key) => {
  if (value !== null) {
      dependListObj[key] = value
   }
  })
// Invoke the callback if dependencies are empty
// Or skip the callback if dependListObj and versionList have different key counts, because some dependencies have a null value
if (dependList.size === 0 || Object.keys(dependListObj).length === dependList.size) {
    props.onDependChange?.(dependListObj)
  }
}, [dependList])
```

That completes CRUD operations for the dependency list. The parent component can respond to changes through the `onDependChange` and `onDependDelete` callbacks.

### Automatically Importing Package Types

TypeScript type hints are one of the most important features of a web IDE, and a central part of this project. This section also introduces a few Monaco concepts. In our IDE, adding a dependency in the left-hand list should dynamically enable its type hints in the code editor. That sounds challenging, but first we need to understand this `monaco API`:

```js
monaco.languages.typescript.typescriptDefaults.addExtraLib(content, "")
```

This API lets us add files to `monaco`, specifying their names and contents. For example, we can add the types for `lodash` APIs like this:

```js
window.monaco?.languages.typescript.javascriptDefaults.addExtraLib(LODASH_index, '@types/lodash/index.d.ts');
window.monaco?.languages.typescript.javascriptDefaults.addExtraLib(LODASH_common, '@types/lodash/common/common.d.ts');
window.monaco?.languages.typescript.javascriptDefaults.addExtraLib(LODASH_array, '@types/lodash/common/array.d.ts');
window.monaco?.languages.typescript.javascriptDefaults.addExtraLib(LODASH_collection, '@types/lodash/common/collection.d.ts');
```

So we need both the filenames and the actual contents of the type declaration files. We also need to understand a `model`. When Monaco first loads, it creates a default `model` if you do not provide one. When switching between different `code views`, there is no need to repeatedly create and destroy everything. Usually, we keep the current view in memory and switch models within the same Monaco instance.

How do we load types for the dependencies in the left-hand list? We can still use unpkg to download each package and inspect its `package.json`.

```js
private async resolveFile(url: string) {
    const res = await fetch(url, { method: 'GET' });
    if (res.ok) {
      return await res.text();
    } else if (res.status === 404) {
      return '';
    } else {
      throw Error(`Error other than 404 while fetching from Unpkg at ${url}`);
    }
  }
```

Pass a package URL to this function to retrieve its `package.json`, then read the `types` or `typings` field. Here is some pseudocode:

```js
const pkg = JSON.parse(pkgJsonTypings);
 if (pkg.typings || pkg.types) {
     const typings = pkg.typings || pkg.types;
     this.createModel(
     content,
     this.monaco.Uri.parse(`node_modules/${typingPackageName}/package.json`)
 );
}
```

We then need a recursive function to resolve relative imports in those files and add every relevant type file to Monaco. At this point, you might be thinking:

> That sounds hard. Is there a library that handles this?

There are not many, but one fits our requirements particularly well: `monaco-editor-auto-typings`. As its official demo shows, it analyzes the code you write. For example:

```js
import * as axios from "axios"
```

It automatically downloads the axios package using a process similar to the one described above. It also caches downloaded dependencies locally in `localstorage`, avoiding repeated calls to the unpkg API. It provides handy options such as `using only specified packages and versions` and `preloading packages`. All we need to do now is integrate it into Monaco.

```js
<IdeCodeContainer {...{
  onMount: handleEditorMount
}} />
```

Store the initialized Monaco instance in state:

```
const [editor, setEditor] = useState<any>();
const [monaco, setMonaco] = useState<any>();
const handleEditorMount: OnMount = (monacoEditor, monaco) => {
  setEditor(monacoEditor)
  setMonaco(monaco)
}
```

After initialization, load the `monaco-editor-auto-typings` plugin:

```js
const typingsRef = useRef<any>(null);
  useEffect(() => {
    if (editor && monaco) {
      // Convert the depend array to an object
      const depend = hookInfo?.depend?.reduce((acc, cur) => {
        acc[cur.name] = cur.version
        return acc
      }, {} as Depend) || {}
      // Load the typings plugin
      void AutoTypings.create(editor, {
        sourceCache: new LocalStorageCache(),
        monaco: monaco,
        onlySpecifiedPackages: true,
        preloadPackages: true,
        versions: depend,
      }).then(t => {
        typingsRef.current = t;
      })
    }
  }, [editor, monaco, hookInfo?.depend])
```

Notice that the effect depends on `hookInfo?.depend`: when the current script's dependencies change, the plugin is loaded. Three options are particularly important:

```js
onlySpecifiedPackages: true, // Only load packages specified in versions
preloadPackages: true, // Preload
versions: depend, // Specify dependency versions
```

We now have a basic type-hinting setup, but do not celebrate just yet. Dependency changes require some additional handling in `monaco-editor-auto-typings`, for example:

```js
// dependchange callback
  const dependChange = (depend: Depend) => {
    // Call setVersions on the typings class prototype
    if (typingsRef.current) {
      typingsRef.current.setVersions(depend)
      void handleDependChange(depend);
    }
  }

  const dependRemove = (name: string) => {
    typingsRef.current.removePackage(name)
  }
```

We register callbacks for the left-hand dependency component and call `internal methods on the typings plugin`. Keep in mind that these methods do not exist in the original `monaco-editor-auto-typings`. They are available only in `@swordjs/monaco-editor-auto-typings`, my modified version. To keep this article manageable, I will briefly explain those changes in the `Further Reading` section.

If you also want type hints for internal dependencies—for example, `.d.ts` files stored on the backend—the same approach works. Register a `beforeMount` callback on the monaco-react component:

```js
const handleEditorBeforeMount: BeforeMount = (monaco) => {
    void getTypes<Record<string, string>>().then(res => {
      // Iterate over types
      Object.keys(res).forEach(key => {
        const libUri = `inmemory://model${key.replace(/^\\./, '')}`;
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          res[key],
          libUri);
        monaco.editor.createModel(res[key], 'typescript', monaco.Uri.parse(libUri));
      }
      )
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });
    })
  }
```

Wait for the API response, process the dependency names and contents, and add them directly to Monaco. You can then import those predefined types in the IDE like this:

```js
import * as a from "./auto/index"
```

At this point, the IDE is taking shape. It supports type hints for both external and internal dependencies and should cover most requirements. In fact, you could add sharing functionality and use it much like CodeSandbox.

### Running and Compiling Code

Our particular technology stack uses `Go` on the backend, but a `Node.js` service is still the better choice for executing TypeScript scripts. Although there are good JavaScript runtime implementations in Go, Node has many successful examples of running TypeScript. I also have substantial experience in this area, having worked with `TypeScript runtimes` for a while. The plan is therefore to have Go invoke a Node command, let Node execute the TypeScript file, and return both the logs and the execution result.

To keep communication between Go and Node.js simple, Go can read `stdout` directly. The Node.js implementation is straightforward: a small wrapper that executes the script.

```js
const { register } = require('esbuild-register/dist/node');
const { join } = require('path');

register();

const hookPath = join(__dirname, './.wundergraph/new_hook/auth/demo');

// console.log output
const logs = [];
let result;
var log = console.log;
// Override console.log
console.log = function () {
  logs.push([...arguments]);
};

const init = async () => {
  try {
    await require(hookPath).default();
  } catch (e) {
    result = e;
  }
  log(
    JSON.stringify({
      logs,
      result,
    })
  );
};

init();
```

This script overrides `console` to capture the script's log output in an array. It uses the runtime registration tool `esbuild-register/dist/node`; alternatives such as `ts-node` or `swc-register` work too. When Go invokes Node.js, it only needs to pass a `script path` on the backend. Likewise, the client only needs to send a `script path` when requesting execution. Go reads a JSON string from `stdout` and returns it to the frontend.

On the frontend, we need another Monaco editor for entering parameters. The contents of this editor will become the function arguments in Node.js. For example:

```js
{
 "hello": "seho"
}
```

```js
export default(params){
 console.log(params); // {"hello": "seho"}
}
```

A simple check to ensure that the input is valid JSON is all we need. Easy enough:

```js
let parseCode;
try {
   const code: string = editorRef.current.getValue().replace(/\\s/g, '');
   parseCode = JSON.parse(code) as { [key: string]: any };
} catch (error) {
   // Not in json format
   void message.warning('Script contents are not in json format');
   return;
}
```

### [Further Reading] A Brief Look Inside monaco-editor-auto-typings

Earlier, we introduced `monaco-editor-auto-typings`, modified a few of its methods, and implemented functionality that the original author had left as `TODO`. My implementation may differ from what the author intended. Time was limited, and I did not examine the entire plugin, so there may also be side effects. This is only a brief introduction, focused on meeting our requirements.

First, we implemented the internal `setVersions` method, completing the author's `TODO`:

```js
public setVersions(versions: { [packageName: string]: string }) {
    this.importResolver.setVersions(versions);
    this.options.versions = versions;
    this.refresh();
  }
```

Inside it, I call `setVersions` on the `importResolver` instance:

```js
public setVersions(versions: { [packageName: string]: string }) {
    this.versions = versions;
    this.loadPackage(versions);
    this.options.onUpdateVersions?.(versions);
  }
```

This updates the `versions` variable and calls the newly added `loadPackage` method:

```js
// load / reload package
  private async loadPackage(versions: Options['versions']) {
    for (const [packageName, version] of Object.entries(versions || {})) {
      this.resolveImport(
        {
          kind: 'package',
          packageName: packageName,
          importPath: '',
        },
        new RecursionDepth(this.options)
      ).catch(e => {
        console.error(e);
      });
    }
  }
```

This function calls the existing `resolveImport` method again, which analyzes the code and loads the types. It is worth noting that we can also call this function when `preloadPackages` and `versions` are configured in `monaco-editor-auto-typings`:

```js
if (options.preloadPackages && options.versions) {
  this.versions = this.options.versions;
  this.loadPackage(this.versions);
}
```

I also made a small change inside `resolveImport` to suit our requirements. See the comments for the details:

```js
let hash = this.hashImportResourcePath(importResource);
    // typings will infer the imported package based on the existing code, and download it actively, and record it through an array of loadfiles;
    // This variable is mainly used to optimize the performance of the plugin to avoid repeated loading; but if the onlySpecifiedPackages of the current option is true, then typings will not be able to rely on code to import packages, so in this case, the function should not return an empty return , but try another import
    // hash root demo: react/package.json
    if (this.options.onlySpecifiedPackages) {
      let _hash = hash;
      // If the hash exists in package.json
      if (hash.indexOf('/package.json') > -1) {
        _hash = hash.substring(0, hash.indexOf('/package.json'));
      }
      if (!Object.keys(this.versions || []).includes(_hash)) return;
    }
    if (this.loadedFiles.includes(hash)) {
      return;
    }
    this.loadedFiles.push(hash);
```

In short, each dependency download is recorded with a hash to avoid downloading it again. This is an internal optimization. Our requirements are different, though: we need to reimport dependencies according to externally supplied versions. Under certain conditions, that optimization therefore needs to be bypassed.

Removing a dependency requires more than simply updating `versions`, so I added a `removePackage` method:

```js
public async removePackage(packageName: string) {
    const packageRootPath = `${packageName}/package.json`;
    this.removeModel(this.monaco.Uri.parse(this.options.fileRootPath + path.join(`node_modules/${packageRootPath}`)));
    // delete version
    if (this.versions && this.versions[packageName]) {
      delete this.versions![packageName];
      // delete hashfiles
      const index = this.loadedFiles.indexOf(packageRootPath);
      if (index > -1) {
        this.loadedFiles.splice(index, 1);
      }
      this.setVersions(this.versions);
    }
    // Find type in package.json, and remove the corresponding type model
    let pkgJson = await this.resolvePackageJson(packageName);
    if (pkgJson) {
      const pkg = JSON.parse(pkgJson);
      if (pkg.typings || pkg.types) {
        const typings = pkg.typings || pkg.types;
        this.removeModel(this.monaco.Uri.parse(this.options.fileRootPath + path.join(`node_modules/${packageName}/${typings.startsWith('./') ? typings.slice(2) : typings}`)));
      }
    }
  }
```

We need to delete not only the dependency's `package.json model`, but also the corresponding `types/typings model`. We must also remove its cached hash so that importing the dependency again will work properly.

```js
private removeModel(uri: monaco.Uri) {
    uri = uri.with({ path: uri.path.replace('@types/', '') });
    const model = this.monaco.editor.getModel(uri);
    if (model) {
      model.dispose();
      this.newImportsResolved = true;
    }
  }
```

The new `removeModel` method is straightforward: find the model, then call `dispose`. Finally, add a refresh function so that external calls to `setVersions` or removal methods leave the code view displaying the correct type declarations. Monaco does not expose a dedicated refresh function, but this mechanism produces a similar effect, so we will call it a refresh for now:

```js
public refresh(){
    const model = this.editor.getModel();
    model?.setValue(model.getValue());
  }
```

That completes our changes to `monaco-editor-auto-typings`. It now fits our requirements, and the modifications are fairly simple. If you are interested, following the comments should make them easy to understand.

## Conclusion

We have implemented the basic features of a web IDE and worked through the pitfalls of doing so in Next.js. I hope this gives you some useful ideas, especially if you are new to web IDEs. After reading this article, you should have a broad understanding of Monaco. Growth comes gradually through practice, so keep thinking, keep building, and when existing tools fall short, do not be afraid to explore and extend them.
