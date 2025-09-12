// Executa os jobs necessários para manutenção do Banco de Dados
import logger from './lib/logger.js';
import cron from 'node-cron'

import fs from "fs";
import moment from 'moment';
import path from "path";
const jobsDirectory = path.resolve("./api/v1/jobs");

// Função para carregar dinamicamente os jobs
const loadJobs = async () => {
    const jobFiles = fs.readdirSync(jobsDirectory).filter(file => file.endsWith(".js"));
    const jobs = [];

    for (const file of jobFiles) {
        const job = await import(`./jobs/${file}`);
        jobs.push(job.default);
    }

    return jobs;
};

const initJobs = () => {
    cron.schedule("*/5 * * * *", async () => {
        logger.info("Executando os jobs de manutenção do Banco de Dados");

        const jobs = await loadJobs();
        for (const job of jobs) {
            try {
                await job();
            } catch (error) {
                logger.error(`Não foi possível executar o job ${job}`, error);
            }
        }
        logger.info("Jobs de manutenção do Banco de Dados executados com sucesso");

    });
}

export default initJobs