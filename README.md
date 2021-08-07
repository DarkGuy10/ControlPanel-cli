# ControlPanel-cli
A command line tool for [ControlPanel dashboard](https://github.com/ControlPanel-gg/dashboard) <br>

```json
//config.json
{
    "controlpanel": {
        "host": "",
        "key": ""
    },
    "pterodactyl": {
        "host": "",
        "key": ""
    }
}

```

```sh
# Profile Management
cpcli profiles list
cpcli profiles list PROFILE
cpcli profiles create PROFILE
cpcli profiles remove PROFILE
cpcli profiles use PROFILE

# User Management (default output file users.json)
cpcli users fetch --output=FILE.json

# Server Management (default output file if output >= 50 lines : servers.json)
cpcli servers fetch --output=FILE.json
cpcli servers fetch --egg=EGG --output=FILE.json
cpcli servers fetch --nest=NEST --output=FILE.json
cpcli servers delete --all
cpcli servers delete --egg=EGG
cpcli servers delete --nest=NEST
cpcli servers prune # Deletes all suspended servers

# Voucher Management (default output file if output >= 50 lines : vouchers.json)
cpcli vouchers fetch --output=FILE.json
cpcli vouchers fetch --valid --output=FILE.json
cpcli vouchers create --memo=MEMO --code=CODE --credits=CREDITS --uses=USES --expires-at=EXPIRES-AT(dd-mm-yyyy)
```