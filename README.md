# Sheeep

Local-first notes and docs inside VS Code. Sheeep stores pages as files in your repository, gives them a custom editor, and keeps the workflow friendly to version control, agents, and normal project review.

[Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=jaseunda.sheeep) · `VS Code ^1.85.0` · MIT

## Screenshots

### Welcome page

![Welcome page](./welcome.png)

### Slash menu

![Slash menu](./using-slash.png)

### Icon and emoji picker

![Emoji picker](./clicking-emoji.png)

### PDF presentation mode

![PDF presentation mode](./pdf-fullscreen-preview.png)

## What Sheeep Does

- Edits `.shp` pages in a custom rich editor instead of raw JSON
- Generates starter docs, examples, and agent guidance directly into your workspace
- Opens PDF, Excel, and DOCX files inside Sheeep
- Presents PDFs in a local browser route on `localhost:7865` for full-screen slide navigation
- Supports hybrid `README.shp` and `README.md` files with embedded Sheeep source

## Starter Template

Run `Sheeep: Generate Starter Templates` from the Command Palette to copy the entire bundled template into your workspace.

- Starter page and documentation set
- Sample PDF, Excel, and DOCX files for viewer testing
- A root `SKILL.md` guide so agents can create and edit pages correctly

## README Hybrid Mode

For `README.shp` and `README.md`, Sheeep stores the page source in a hidden comment block and generates the visible Markdown body from that source. This keeps GitHub readable without giving up the richer Sheeep document model.

Do not edit the generated Markdown body outside Sheeep. Open the README in the Sheeep editor and let the extension regenerate it.

## License

MIT © jas
