import os
import PluginUtils
import Millennium

logger = PluginUtils.Logger()


def steamtools_get_ids(showDisabled):

    path = os.path.join(Millennium.steam_path(), "config", "stplug-in").replace("\\", "/")

    if not os.path.exists(path):
        return ""

    ids = []
    for file in os.listdir(path):
        if file.endswith(".lua") and (showDisabled or not file.endswith("disabled")):
            id = file.split(".lua")[0]
            if id:
                ids.append(id)

    return ", ".join(ids)



class Plugin:
    def _front_end_loaded(self):
        logger.log("Front end loaded")

    def _load(self):

        logger.log("Loading backed")

        Millennium.ready()

    def _unload(self):
        logger.log("Nothing to unload..")

plugin = Plugin()