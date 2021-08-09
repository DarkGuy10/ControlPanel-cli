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
dashboard profiles list
dashboard profiles list PROFILE
dashboard profiles create PROFILE
dashboard profiles remove PROFILE
dashboard profiles use PROFILE

# User Management (default output file: users.json)
dashboard users fetch [--output=FILE.json]

# Server Management (default output file: servers.json)
# NOTE : FLAG CHAINING IS NOT SUPPORTED IN SERVER MANAGEMENT YET
# Using "--egg=EGG --suspended" will delete all servers of that egg irrespective of suspended or not
dashboard servers fetch [--egg=EGG] [--nest=NEST] [--suspended] [--output=FILE.json]
dashboard servers delete [--egg=EGG] [--nest=NEST] [--suspended] [--all]

# Voucher Management (default output file: vouchers.json)
dashboard vouchers fetch [--valid] [--invalid] [--output=FILE.json]
dashboard vouchers delete [--valid] [--invalid] [--all]
```