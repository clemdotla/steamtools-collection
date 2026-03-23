# Requirements
- Millennium, install from:
  - [Powershell script](<https://github.com/clemdota/millennium-installer-ps1>)
  - [Official website](<https://steambrew.app>)

# Installation
## Easy way
> Using the [plugin installer ps1 script](<https://github.com/clemdotla/luatools-installer>)
```ps
iex "& { $(irm 'clemdotla.github.io/luatools-installer/install-plugin.ps1') } -DownloadLink 'https://github.com/clemdotla/steamtools-collection/releases/download/Latest/steamtools-collection.zip' $PluginName 'steamtools-collection'"
```
-# Open source, made it myself

## Manual way
- Download the .zip from [releases](<https://github.com/clemdotla/steamtools-collection/releases/tag/Latest>)
- Extract in `C:\Program Files (x86)\Steam\plugins`
- Restart steam
- Toggle the plugin on ("Steam" on top left, "Millennium", "Plugins")


# To-do
- [ ] Add "remove/disable" to context menu (library)
- [ ] Verify .lua content (depots+dlc+workshop+tokens)

# Credits
- clem.la — https://discord.com/users/868170669412745216  
- luthor112 — https://github.com/luthor112  
  - Inspiration from:  
    - https://github.com/luthor112/steam-librarian/  
    - https://github.com/luthor112/steam-collections-plus  
- Millennium / Steambrew — https://steambrew.app
