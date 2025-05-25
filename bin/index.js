#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

const program = new Command();
const pkg = require("../package.json");

program
  .name("devblock-explorer")
  .description("CLI to scaffold a developer-oriented block explorer project")
  .version(pkg.version);

program
  .command("new")
  .description("Create a new block explorer project")
  .argument("<project-name>", "Name of the new project directory")
  .action(async (projectName) => {
    const currentDir = process.cwd();
    const projectPath = path.join(currentDir, projectName);

    if (fs.existsSync(projectPath)) {
      console.log(chalk.red(`❌ Directory "${projectName}" already exists.`));
      process.exit(1);
    }

    const templateDir = path.join(__dirname, "../templates");

    try {
      await fs.copy(templateDir, projectPath);
      console.log(chalk.green(`✅ Project created at ./${projectName}`));
      console.log();
      console.log(chalk.blue("👉 Next steps:"));
      console.log(chalk.cyan(`   cd ${projectName}`));
      console.log(chalk.cyan(`   npm install`));
      console.log(chalk.cyan(`   npm run dev`));
    } catch (err) {
      console.error(chalk.red("❌ Failed to create project:"), err);
    }
  });

program.parse(process.argv);
