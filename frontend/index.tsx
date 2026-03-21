import { IconsModule, definePlugin, sleep, callable, Field, Toggle, TextField, Button } from "@steambrew/client"
import { useState, useEffect } from "react"

// TODO:
// - Button in context menu to remove/disable

// @ts-ignore
let store = collectionStore;
let pluginConfig = {
    name: "Steamtools",
	replace: true,
	show_disabled: false
};

async function DoStuff() {
	console.log("[steamtools-collection] Refreshing collection")

	const coll = store.GetUserCollectionsByName(pluginConfig.name)?.[0] || store.NewUnsavedCollection(pluginConfig.name, null, []) 
	if (!coll) {
		return console.log("[steamtools-collection] No collection found")
	}

	// Clearing if needed
	if (pluginConfig.replace) {
		coll.RemoveApps([...coll.allApps]);
	}

	const ids = (await callable<[{ showDisabled: boolean }], string>('steamtools_get_ids')({showDisabled: pluginConfig.show_disabled}))
		.split(",")
		.map(Number);
	
	// coll.AddApps(ids)

	for (const id of ids) {
		coll.m_setAddedManually.add(id)
		coll.apps.add(id)
	}

	coll.Save()
	store.SaveCollection(coll)
}

// function AddRemoveButton(){
// 	const div = document.querySelector(
// 	'.contextMenuItem:has(.SVGIcon_Download)'
// 	) ||  document.querySelector(
// 	'.contextMenuItem:has(.SVGIcon_Play)'
// 	)
// 	if (!div) return console.log("No button found")

// 	div.textContent = "Remove"

// 	console.log(div)
// }

async function pluginMain() {
	console.log("[steamtools-collection] Frontend startup")
	
	// @ts-ignore
    await App.WaitForServicesInitialized();

    while (
		// @ts-ignore
        typeof collectionStore === 'undefined'
    ) { await sleep(100) }
	// @ts-ignore
	store = collectionStore

	
	const storedConfig = JSON.parse(localStorage.getItem("clem.la.steamtools-collection.config"));
    pluginConfig = { ...pluginConfig, ...storedConfig };
    console.log("[steamtools-collection] Merged config:", pluginConfig);

	await DoStuff()

}





// Settings

const SingleSetting = (props: any) => {
    const [boolValue, setBoolValue] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const saveConfig = () => {
        localStorage.setItem("clem.la.steamtools-collection.config", JSON.stringify(pluginConfig));
    };



    useEffect(() => {
        if (props.type === "bool") {
            setBoolValue(pluginConfig[props.name]);
        }

        if (props.readonly) {
            setIsDisabled(true);
        }
    }, []);

	switch (props.type) {
		case "bool":
			return (
				<Field label={props.label} description={props.description} bottomSeparator= {props.bottomSeparator || "standard"} focusable>
					<Toggle disabled={isDisabled} value={boolValue} onChange={(value) => { setBoolValue(value); pluginConfig[props.name] = value; saveConfig(); }} />
				</Field>
			);

		case "text":
			return (
				<Field label={props.label} description={props.description} bottomSeparator={props.bottomSeparator || "standard"} focusable>
					<TextField disabled={isDisabled} defaultValue={pluginConfig[props.name]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { pluginConfig[props.name] = e.currentTarget.value; saveConfig(); }} />
				</Field>
			);

		case "button":
			return (
				<Field label={props.label} description={props.description} bottomSeparator= {props.bottomSeparator || "standard"} focusable>
					<Toggle disabled={isDisabled} value={boolValue} onChange={async (value) => {
						if (value) {
							setBoolValue(true)

							try { await props.action() } catch (e) { console.error(e) }
							setTimeout(() => { setBoolValue(false) }, 500)
						}
					}} />
				</Field>
			)
	} 
}

const SettingsContent = () => {
	return (
        <div>
            <SingleSetting name="name" type="text" label="Collection name" description="The name of the targeted collection" />
            <SingleSetting name="replace" type="bool" label="Empty the collection before adding" description="Will remove previously added games to get current ones only." bottomSeparator="none" />
            <SingleSetting name="show_disabled" type="bool" label="Show disabled games" description="Shouldn't be visible in the library but still.." />

			{/* Empty */}
			<Field bottomSeparator="thick"></Field>

			<SingleSetting name="refresh" type="button" label="Refresh collection" description="Refresh the collection for some reason" bottomSeparator="standard" action={DoStuff} />

		</div>
	);
};


export default definePlugin(async () => {
	await pluginMain()
	return {
		title: "Steamtools collection",
		icon: <IconsModule.Settings />,
		content: <SettingsContent />
	}
})
