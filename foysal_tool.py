#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Foysal Tool - a clean Termux tool (Python 3, no external dependencies)."""

import os
import platform
import shutil
import subprocess
import sys
import time

# ---------- Colors ----------
GREEN = "\033[92m"
CYAN = "\033[96m"
YELLOW = "\033[93m"
RED = "\033[91m"
WHITE = "\033[97m"
DIM = "\033[2m"
BOLD = "\033[1m"
RESET = "\033[0m"

FOYSAL = [
    r" _____                     _ ",
    r"|  ___|__  _   _ ___  __ _| |",
    r"| |_ / _ \| | | / __|/ _` | |",
    r"|  _| (_) | |_| \__ \ (_| | |",
    r"|_|  \___/ \__, |___/\__,_|_|",
    r"           |___/             ",
]

TOOL = [
    r" _____           _ ",
    r"|_   _|__   ___ | |",
    r"  | |/ _ \ / _ \| |",
    r"  | | (_) | (_) | |",
    r"  |_|\___/ \___/|_|",
    r"                    ",
]


def clear():
    os.system("clear")


def banner():
    clear()
    print()
    for left, right in zip(FOYSAL, TOOL):
        print(f"{GREEN}{BOLD}{left}  {right}{RESET}")
    print()
    print(f"{WHITE}{BOLD}Developer: Foysal ahmed{RESET}")
    print(f"{GREEN}{'=' * 50}{RESET}")


def line():
    print(f"{DIM}{'-' * 50}{RESET}")


def pause():
    input(f"\n{DIM}Press Enter to continue...{RESET}")


def menu():
    print()
    print(f"{CYAN}{BOLD}  MAIN MENU{RESET}")
    line()
    print(f"  {GREEN}[1]{RESET} System Information")
    print(f"  {GREEN}[2]{RESET} Storage Information")
    print(f"  {GREEN}[3]{RESET} Date and Time")
    print(f"  {GREEN}[4]{RESET} Python Environment")
    print(f"  {GREEN}[5]{RESET} Install Requirements (Termux setup)")
    print(f"  {GREEN}[6]{RESET} Clone META-HORIZONE Repository")
    print(f"  {RED}[0]{RESET} Exit")
    line()


def row(label, value):
    print(f"  {YELLOW}{label:<16}{RESET}: {WHITE}{value}{RESET}")


def system_info():
    banner()
    print(f"\n{CYAN}{BOLD}  SYSTEM INFORMATION{RESET}")
    line()
    row("OS", platform.system())
    row("Release", platform.release())
    row("Architecture", platform.machine())
    row("Hostname", platform.node())
    row("Home", os.path.expanduser("~"))
    row("Shell", os.environ.get("SHELL", "unknown"))
    row("Prefix", os.environ.get("PREFIX", "unknown"))
    line()
    pause()


def storage_info():
    banner()
    print(f"\n{CYAN}{BOLD}  STORAGE INFORMATION{RESET}")
    line()
    total, used, free = shutil.disk_usage(os.path.expanduser("~"))
    gb = 1024 ** 3
    percent = used / total * 100
    row("Total", f"{total / gb:.2f} GB")
    row("Used", f"{used / gb:.2f} GB")
    row("Free", f"{free / gb:.2f} GB")
    row("Usage", f"{percent:.1f}%")
    filled = int(percent / 5)
    bar = "#" * filled + "." * (20 - filled)
    print(f"\n  {GREEN}[{bar}]{RESET}")
    line()
    pause()


def date_time():
    banner()
    print(f"\n{CYAN}{BOLD}  DATE AND TIME{RESET}")
    line()
    now = time.localtime()
    row("Date", time.strftime("%A, %d %B %Y", now))
    row("Time", time.strftime("%H:%M:%S", now))
    row("Timezone", time.strftime("%Z", now))
    line()
    pause()


def python_env():
    banner()
    print(f"\n{CYAN}{BOLD}  PYTHON ENVIRONMENT{RESET}")
    line()
    row("Version", platform.python_version())
    row("Implementation", platform.python_implementation())
    row("Executable", sys.executable)
    row("Compiler", platform.python_compiler())
    line()
    pause()


APT_OPTS = (
    '-o Dpkg::Options::="--force-confnew" '
    '-o Dpkg::Options::="--force-confdef"'
)
REPO_URL = "https://github.com/djpagla12121-web/META-HORIZONE.git"
REPO_DIR = "META-HORIZONE"


def run_shell(command, title):
    """Run a shell command in non-interactive mode and show its status."""
    env = dict(os.environ)
    env["DEBIAN_FRONTEND"] = "noninteractive"
    env["APT_LISTCHANGES_FRONTEND"] = "none"
    print(f"\n{CYAN}  >> {title}{RESET}")
    try:
        code = subprocess.call(command, shell=True, env=env)
    except KeyboardInterrupt:
        print(f"\n{RED}  Cancelled.{RESET}")
        return False
    if code != 0:
        print(f"{RED}  [FAILED] {title} (exit code {code}){RESET}")
        return False
    print(f"{GREEN}  [OK] {title}{RESET}")
    return True


def install_requirements():
    banner()
    print(f"\n{CYAN}{BOLD}  INSTALL REQUIREMENTS{RESET}")
    line()
    steps = [
        ("Updating package lists", f"pkg update -y {APT_OPTS}"),
        ("Upgrading installed packages", f"pkg upgrade -y {APT_OPTS}"),
        ("Requesting storage access", "termux-setup-storage"),
        (
            "Installing Python, pip, repositories and git",
            f"pkg install -y {APT_OPTS} python python-pip tur-repo x11-repo git",
        ),
        ("Refreshing package lists", f"pkg update -y {APT_OPTS}"),
        (
            "Installing Firefox and Geckodriver",
            f"pkg install -y {APT_OPTS} firefox geckodriver",
        ),
        (
            "Installing Python modules (httpx, h2, selenium)",
            "pip install --quiet httpx h2 selenium",
        ),
    ]
    for title, cmd in steps:
        if not run_shell(cmd, title):
            print(f"\n{YELLOW}  Setup stopped because a step failed.{RESET}")
            pause()
            return

    print(f"\n{GREEN}{'=' * 50}{RESET}")
    print(f"{GREEN}{BOLD}  Installation completed successfully!{RESET}")
    print(f"{GREEN}{'=' * 50}{RESET}")
    run_shell("python --version", "Python version")
    run_shell("firefox --version", "Firefox version")
    run_shell("geckodriver --version | head -n 1", "Geckodriver version")
    run_shell(
        "python -c \"import httpx, h2, selenium; "
        "print('httpx, h2, selenium = OK')\"",
        "Module check",
    )
    pause()


def clone_repository():
    banner()
    print(f"\n{CYAN}{BOLD}  CLONE REPOSITORY{RESET}")
    line()
    target = os.path.join(os.path.expanduser("~"), REPO_DIR)
    row("Source", REPO_URL)
    row("Target", target)
    line()
    if os.path.exists(target):
        answer = input(
            f"  {YELLOW}{target} already exists and will be deleted. "
            f"Continue? [y/N]{RESET} > "
        ).strip().lower()
        if answer != "y":
            print(f"\n{RED}  Cancelled.{RESET}")
            pause()
            return

    command = (
        "pkg update -y && pkg install -y git && "
        f'cd "$HOME" && rm -rf {REPO_DIR} && '
        f"git clone {REPO_URL} && cd {REPO_DIR} && ls"
    )
    run_shell(command, "Cloning repository")
    pause()


def main():
    actions = {
        "1": system_info,
        "2": storage_info,
        "3": date_time,
        "4": python_env,
        "5": install_requirements,
        "6": clone_repository,
    }
    while True:
        banner()
        menu()
        try:
            choice = input(f"  {GREEN}{BOLD}Select an option{RESET} > ").strip()
        except (KeyboardInterrupt, EOFError):
            choice = "0"

        if choice == "0":
            print(f"\n{GREEN}  Goodbye!{RESET}\n")
            break
        action = actions.get(choice)
        if action:
            action()
        else:
            print(f"\n{RED}  Invalid option. Try again.{RESET}")
            time.sleep(1)


if __name__ == "__main__":
    main()
