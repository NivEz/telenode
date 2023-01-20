/**
 * This script requires a specific example from this directory and runs it.
 * Just pass --file to the package.json run dev command like so: `npm --file=hello run dev`
 */

require(`./${process.env.npm_config_file}`);
