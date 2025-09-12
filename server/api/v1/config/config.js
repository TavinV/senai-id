const defaultConfig = {
    "horarios": {
        "tolerancia": {
            "min": -45,
            "max": 14
        },
        "atraso": {
            "min": 15,
            "max": 120
        },
        "intervalo": {
            "inicio": "11:15",
            "fim": "13:45"
        },
        "bloqueio": {
            "min": -45,
            "max": 120
        }
    }
}

import fs from 'fs'
import path from 'path'

const configFileDirectory = path.resolve("./api/v1/config/senai-id-config.json")

const content = fs.readFileSync(configFileDirectory)
const config = JSON.parse(content.toString()) || defaultConfig

export default config