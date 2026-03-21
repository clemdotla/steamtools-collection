local logger = require("logger")
local millennium = require("millennium")
local fs = require("fs")

-- BACKEND

function steamtools_get_ids(showDisabled)
    local path = fs.join(millennium.steam_path(), "config", "stplug-in"):gsub("\\", "/")

    if not fs.exists(path) then
       return ""
    end

    local ids = {}
    local entries, err = fs.list(path)
    for _,v in ipairs(entries) do
        if string.find(v.name, ".lua") and (showDisabled or not string.find(v.name, "disabled")) then 
            local id = v.name:match("%d+")
            if id then
                table.insert(ids, id)
            end
        end
    
    end
  
    return table.concat(ids, ",") -- Must pass a string/boolean i assume
end


-- PLUGIN MANAGEMENT

local function on_frontend_loaded()
    logger:info("Frontend loaded")
end

local function on_load()

    logger:info("Backend loaded")
    millennium.ready()
end

local function on_unload()
    logger:info("Backend unloaded")
end

return {
    on_frontend_loaded = on_frontend_loaded,
    on_load = on_load,
    on_unload = on_unload
}
