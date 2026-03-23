const MILLENNIUM_IS_CLIENT_MODULE = true;
const pluginName = "steamtools-collection";
function InitializePlugins() {
    var _a;
    (_a = (window.PLUGIN_LIST || (window.PLUGIN_LIST = {})))[pluginName] || (_a[pluginName] = {});
    window.MILLENNIUM_SIDEBAR_NAVIGATION_PANELS || (window.MILLENNIUM_SIDEBAR_NAVIGATION_PANELS = {});
}
InitializePlugins()
const __call_server_method__ = (methodName, kwargs) => Millennium.callServerMethod(pluginName, methodName, kwargs)
function __wrapped_callable__(route) {
    if (route.startsWith('webkit:')) {
        return MILLENNIUM_API.callable((methodName, kwargs) => MILLENNIUM_API.__INTERNAL_CALL_WEBKIT_METHOD__(pluginName, methodName, kwargs), route.replace(/^webkit:/, ''));
    }
    return MILLENNIUM_API.callable(__call_server_method__, route);
}
let PluginEntryPointMain = function() { var millennium_main = (function (exports, client, react) {
	'use strict';

	let store = collectionStore;
	let pluginConfig = {
	  name: "Steamtools",
	  replace: true,
	  show_disabled: false
	};
	async function DoStuff() {
	  console.log("[steamtools-collection] Refreshing collection");
	  const coll = store.GetUserCollectionsByName(pluginConfig.name)?.[0] || store.NewUnsavedCollection(pluginConfig.name, null, []);
	  if (!coll) {
	    return console.log("[steamtools-collection] No collection found");
	  }
	  if (pluginConfig.replace) {
	    coll.RemoveApps([...coll.allApps]);
	  }
	  const ids = (await __wrapped_callable__("steamtools_get_ids")({ showDisabled: pluginConfig.show_disabled })).split(",").map(Number);
	  for (const id of ids) {
	    coll.m_setAddedManually.add(id);
	    coll.apps.add(id);
	  }
	  coll.Save();
	  store.SaveCollection(coll);
	}
	async function pluginMain() {
	  console.log("[steamtools-collection] Frontend startup");
	  await App.WaitForServicesInitialized();
	  while (
	    // @ts-ignore
	    typeof collectionStore === "undefined"
	  ) {
	    await client.sleep(100);
	  }
	  store = collectionStore;
	  const storedConfig = JSON.parse(localStorage.getItem("clem.la.steamtools-collection.config"));
	  pluginConfig = { ...pluginConfig, ...storedConfig };
	  console.log("[steamtools-collection] Merged config:", pluginConfig);
	  await DoStuff();
	}
	const SingleSetting = (props) => {
	  const [boolValue, setBoolValue] = react.useState(false);
	  const [isDisabled, setIsDisabled] = react.useState(false);
	  const saveConfig = () => {
	    localStorage.setItem("clem.la.steamtools-collection.config", JSON.stringify(pluginConfig));
	  };
	  react.useEffect(() => {
	    if (props.type === "bool") {
	      setBoolValue(pluginConfig[props.name]);
	    }
	    if (props.readonly) {
	      setIsDisabled(true);
	    }
	  }, []);
	  switch (props.type) {
	    case "bool":
	      return /* @__PURE__ */ window.SP_REACT.createElement(client.Field, { label: props.label, description: props.description, bottomSeparator: props.bottomSeparator || "standard", focusable: true }, /* @__PURE__ */ window.SP_REACT.createElement(client.Toggle, { disabled: isDisabled, value: boolValue, onChange: (value) => {
	        setBoolValue(value);
	        pluginConfig[props.name] = value;
	        saveConfig();
	      } }));
	    case "text":
	      return /* @__PURE__ */ window.SP_REACT.createElement(client.Field, { label: props.label, description: props.description, bottomSeparator: props.bottomSeparator || "standard", focusable: true }, /* @__PURE__ */ window.SP_REACT.createElement(client.TextField, { disabled: isDisabled, defaultValue: pluginConfig[props.name], onChange: (e) => {
	        pluginConfig[props.name] = e.currentTarget.value;
	        saveConfig();
	      } }));
	    case "button":
	      return /* @__PURE__ */ window.SP_REACT.createElement(client.Field, { label: props.label, description: props.description, bottomSeparator: props.bottomSeparator || "standard", focusable: true }, /* @__PURE__ */ window.SP_REACT.createElement(client.Toggle, { disabled: isDisabled, value: boolValue, onChange: async (value) => {
	        if (value) {
	          setBoolValue(true);
	          try {
	            await props.action();
	          } catch (e) {
	            console.error(e);
	          }
	          setTimeout(() => {
	            setBoolValue(false);
	          }, 500);
	        }
	      } }));
	  }
	};
	const SettingsContent = () => {
	  return /* @__PURE__ */ window.SP_REACT.createElement("div", null, /* @__PURE__ */ window.SP_REACT.createElement(SingleSetting, { name: "name", type: "text", label: "Collection name", description: "The name of the targeted collection" }), /* @__PURE__ */ window.SP_REACT.createElement(SingleSetting, { name: "replace", type: "bool", label: "Empty the collection before adding", description: "Will remove previously added games to get current ones only.", bottomSeparator: "none" }), /* @__PURE__ */ window.SP_REACT.createElement(SingleSetting, { name: "show_disabled", type: "bool", label: "Show disabled games", description: "Shouldn't be visible in the library but still.." }), /* @__PURE__ */ window.SP_REACT.createElement(client.Field, { bottomSeparator: "thick" }), /* @__PURE__ */ window.SP_REACT.createElement(SingleSetting, { name: "refresh", type: "button", label: "Refresh collection", description: "Refresh the collection for some reason", bottomSeparator: "standard", action: DoStuff }));
	};
	var index = client.definePlugin(async () => {
	  await pluginMain();
	  return {
	    title: "Steamtools collection",
	    icon: /* @__PURE__ */ window.SP_REACT.createElement(client.IconsModule.Settings, null),
	    content: /* @__PURE__ */ window.SP_REACT.createElement(SettingsContent, null)
	  };
	});

	exports.default = index;

	Object.defineProperty(exports, '__esModule', { value: true });

	return exports;

})({}, window.MILLENNIUM_API, window.SP_REACT);
 return millennium_main; };
async function ExecutePluginModule() {
    let PluginModule = PluginEntryPointMain();
    /** Assign the plugin on plugin list. */
    Object.assign(window.PLUGIN_LIST[pluginName], {
        ...PluginModule,
        __millennium_internal_plugin_name_do_not_use_or_change__: pluginName,
    });
    /** Run the rolled up plugins default exported function */
    let pluginProps = await PluginModule.default();
    function isValidSidebarNavComponent(obj) {
        return obj && obj.title !== undefined && obj.icon !== undefined && obj.content !== undefined;
    }
    if (pluginProps && isValidSidebarNavComponent(pluginProps)) {
        window.MILLENNIUM_SIDEBAR_NAVIGATION_PANELS[pluginName] = pluginProps;
    }
    /** If the current module is a client module, post message id=1 which calls the front_end_loaded method on the backend. */
    if (MILLENNIUM_IS_CLIENT_MODULE) {
        MILLENNIUM_BACKEND_IPC.postMessage(1, { pluginName: pluginName });
    }
}
ExecutePluginModule()