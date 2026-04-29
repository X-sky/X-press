---
outline: deep
title: "Free Your Hands with Keyboard Shortcuts"
description: "Common keyboard shortcuts summary, including system, browser, VS Code, Git Bash, and Vim"
---

# Free Your Hands with Keyboard Shortcuts

## Common Shortcuts

### System Level (Windows 10)

| Shortcut          | Function                          |
| ----------------- | --------------------------------- |
| `Win R`           | Run                               |
| `Win E`           | File Explorer                     |
| `Win Shift S`     | Screenshot                        |
| `Win Tab`         | Open Task View                    |
| `Win D`           | Show Desktop (hide all apps)      |
| `Win S`           | Open Search                       |
| `Win Right`       | Split screen left/right           |
| `Win Up`          | Maximize current app              |
| `Win Down`        | Restore down                      |
| `Alt F4`          | Close current app                 |
| `Alt ESC`         | Minimize current app              |
| `Alt Tab`         | Switch apps clockwise             |
| `Alt Shift Tab`   | Switch apps counter-clockwise     |

#### Common Editing Operations

| Shortcut   | Function       |
| ---------- | -------------- |
| `Ctrl A`   | Select all     |
| `Ctrl X`   | Cut            |
| `Ctrl C`   | Copy           |
| `Ctrl V`   | Paste          |
| `Ctrl Z`   | Undo           |
| `Ctrl Y`   | Redo           |

### Browser

Standard shortcuts for `Chrome`-like browsers can be found in [Microsoft's official guide](https://support.microsoft.com/en-us/microsoft-edge/keyboard-shortcuts-in-microsoft-edge-50d3edab-30d9-c7e4-21ce-37fe2713cfad). Some commonly used ones are listed below:

| Shortcut           | Function                    |
| ------------------ | --------------------------- |
| `Ctrl F`           | Search current page content |
| `Ctrl R`           | Refresh current page        |
| `Ctrl Shift R`     | Hard refresh (ignore cache) |
| `Ctrl Shift I`     | Open Developer Tools        |
| `Ctrl T`           | New tab                     |
| `Ctrl W`           | Close current tab           |
| `Ctrl Shift W`     | Close current window        |
| `Ctrl N`           | New window                  |
| `Ctrl Shift N`     | New InPrivate window        |
| `Ctrl L`           | Edit current URL            |
| `Ctrl Tab`         | Switch tabs clockwise       |
| `Ctrl Shift Tab`   | Switch tabs counter-clockwise |
| `Ctrl Shift K`     | Duplicate tab               |

Some browser shortcuts are shared with VS Code, such as closing tabs, switching tabs, and reopening recently closed tabs.

### VS Code

| Shortcut           | Function                                        |
| ------------------ | ----------------------------------------------- |
| `Ctrl`             | Jump across words                               |
| `Ctrl ·`           | Open integrated terminal                        |
| `Ctrl N`           | New file                                        |
| `Ctrl Shift N`     | New window                                      |
| `Ctrl P`           | Open file                                       |
| `Ctrl Shift P`     | Command Palette                                 |
| `Ctrl F`           | Search in file (Enter/Shift Enter to navigate)  |
| `Ctrl Shift F`     | Global search (auto-copies current selection)   |
| `Ctrl D`           | Find and select                                 |
| `Ctrl G`           | Go to line                                      |
| `Ctrl B`           | Toggle sidebar                                  |
| `Ctrl Shift E`     | Open sidebar Explorer                           |
| `Ctrl Shift X`     | Open sidebar Extensions                         |
| `Alt Up`           | Move current line up (Down likewise)            |
| `Alt Shift Up`     | Copy current line above (Down likewise)         |
| `Ctrl \|`          | Split right                                     |
| `Ctrl Alt Right`   | Move current tab right                          |

### Git Bash

General operations:

`Ctrl+Z` in commands can send a task to the background;

`jobs -l` lists current tasks, combined with `fg [jobnumber]` and `bg [jobnumber]` for task scheduling.

| Shortcut     | Function                            |
| ------------ | ----------------------------------- |
| `Ctrl + a`   | Move to beginning of line           |
| `Ctrl + e`   | Move to end of line                 |
| `Ctrl + u`   | Delete from cursor to line start    |
| `Ctrl + k`   | Delete from cursor to line end      |
| `Ctrl + w`   | Delete from cursor to word start    |
| `Alt + d`    | Delete from cursor to word end      |
| `Alt + f`    | Move forward by word (right)        |
| `Alt + b`    | Move backward by word (left)        |
| `Alt + u`    | Uppercase from cursor to end        |
| `Alt + l`    | Lowercase from cursor to end        |

### Vim

A powerful editor with three modes: `command`, `insert`, and `visual`.

#### Initial Setup

1. `vim ~/.vimrc` — enter the `.vimrc` configuration file
2. Add the following configuration in `.vimrc`:

```bash
set number # Show line numbers
set syntax=on # Enable syntax highlighting
```

#### Common Operations

##### Command Mode

Press `Esc` in any mode to enter command mode. This is Vim's default mode.

| Navigation Shortcut | Function           |
| ------------------- | ------------------ |
| `w`                 | Next word          |
| `b`                 | Previous word      |
| `Shift + G`         | End of file        |
| `Shift ^`           | Beginning of line  |
| `Shift $`           | End of line        |
| `:[%1, %2]`         | From line %1 to %2 |

| Action Shortcut | Function             |
| --------------- | -------------------- |
| `u`             | Undo last action     |
| `.`             | Repeat last action   |
| `n`             | Move cursor          |
| `d`             | Cut                  |
| `dd`            | Cut entire line      |
| `y`             | Copy                 |
| `yy`            | Copy entire line     |
| `p`             | Paste                |
| `Shift + G`     | End of file          |
| `<<`            | Indent left          |

By combining position + count + action from above, you can perform various rapid text operations:

| Combined Shortcut   | Function                              |
| ------------------- | ------------------------------------- |
| `dw`                | Cut next word                         |
| `db`                | Delete previous word                  |
| `dgg`               | Cut from cursor to file start         |
| `d + Shift + G`     | Cut from cursor to file end           |
| `d + Shift ^`       | Cut to line start                     |
| `d3d`               | Quick cut 3 lines                     |
| `d121gg`            | Cut to line 121                       |
| `:1,5d`             | Cut lines 1-5                         |
| `:1,5 m/co 10`      | Move/copy lines 1-5 to line 10       |

Additionally, there are window-level shortcuts:

| Window Shortcut  | Function                                                     |
| ---------------- | ------------------------------------------------------------ |
| `w`              | Save                                                         |
| `q`              | Quit, add `!` to force                                       |
| `i / a / o`      | Enter insert mode at cursor / after cursor / new line        |
| `v`              | Enter visual mode                                            |
| `:reg`           | View system clipboard, usually combined with p for quick paste |
| `!ls`            | Use ! to call bash commands, e.g., ls                        |

Combined with window-level shortcuts, even more operations are possible:

| Combined Shortcut     | Function                              |
| --------------------- | ------------------------------------- |
| `"1p`                 | Paste clipboard entry "1              |
| `:sp %filename`       | Open %filename above                  |
| `:vs %filename`       | Open %filename to the right           |
| `Ctrl + w + arrow`    | Switch editor after split             |
| `:e %filename`        | Switch current window to %filename    |
| `!ls`                 | Use ! to call bash commands, e.g., ls |

`vim` usage could fill an entire chapter on its own. We won't expand on `visual mode` and `insert mode` here.
