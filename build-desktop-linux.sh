#!/bin/bash

# MonitorPLC Desktop Build Script for Linux

echo ""
echo "========================================"
echo "  MonitorPLC Desktop Builder (Linux)"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    echo "Or run: curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi

echo "[OK] Node.js is installed:"
node --version

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed"
    exit 1
fi

echo "[OK] npm is installed:"
npm --version

# Check required build tools for Linux
echo ""
echo "Checking required build tools..."

if ! command -v build-essential &> /dev/null && ! command -v gcc &> /dev/null; then
    echo "[WARNING] build-essential not found"
    echo "For better build support, install:"
    echo "  Ubuntu/Debian: sudo apt-get install build-essential libssl-dev pkg-config"
    echo "  Fedora: sudo dnf install gcc gcc-c++ make libssl-devel pkg-config"
    echo "  Arch: sudo pacman -S base-devel"
fi

echo ""

# Show menu
show_menu() {
    echo "Select build option:"
    echo "1. Development (electron-dev - run with hot reload)"
    echo "2. Build Linux AppImage"
    echo "3. Build Linux DEB Package"
    echo "4. Build Both Linux Installers"
    echo "5. Install Dependencies"
    echo "6. Exit"
    echo ""
    read -p "Enter your choice (1-6): " choice
}

# Process menu selection
process_choice() {
    case $choice in
        1)
            echo ""
            echo "Starting development mode..."
            echo ""
            cd FE
            npm run electron-dev
            ;;
        2)
            echo ""
            echo "Building Linux AppImage..."
            echo "This will take a few minutes..."
            echo ""
            cd FE
            mkdir -p build-runtime
            cp "$(command -v node)" build-runtime/node
            chmod +x build-runtime/node
            npm run electron-build:linux:appimage
            if [ $? -eq 0 ]; then
                echo ""
                echo "[SUCCESS] Build completed!"
                echo "AppImage created in: FE/release/"
                echo ""
                ls -lh release/MonitorPLC*.AppImage 2>/dev/null || echo "AppImage not found"
            else
                echo "[ERROR] Build failed"
                exit 1
            fi
            ;;
        3)
            echo ""
            echo "Building Linux DEB Package..."
            echo "This will take a few minutes..."
            echo ""
            cd FE
            mkdir -p build-runtime
            cp "$(command -v node)" build-runtime/node
            chmod +x build-runtime/node
            npm run electron-build:linux:deb
            if [ $? -eq 0 ]; then
                echo ""
                echo "[SUCCESS] Build completed!"
                echo "DEB package created in: FE/release/"
                echo ""
                ls -lh release/*.deb 2>/dev/null || echo "DEB package not found"
            else
                echo "[ERROR] Build failed"
                exit 1
            fi
            ;;
        4)
            echo ""
            echo "Building both Linux installers..."
            echo "This will take a few minutes..."
            echo ""
            cd FE
            mkdir -p build-runtime
            cp "$(command -v node)" build-runtime/node
            chmod +x build-runtime/node
            npm run electron-build:linux
            if [ $? -eq 0 ]; then
                echo ""
                echo "[SUCCESS] Build completed!"
                echo "Installers created in: FE/release/"
                echo ""
                ls -lh release/MonitorPLC* release/*.deb 2>/dev/null || echo "Files not found"
            else
                echo "[ERROR] Build failed"
                exit 1
            fi
            ;;
        5)
            echo ""
            echo "Installing dependencies..."
            echo ""
            npm install
            cd BE && npm install && cd ..
            cd FE && npm install && cd ..
            echo ""
            echo "[SUCCESS] Dependencies installed!"
            ;;
        6)
            echo ""
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid choice. Please try again."
            ;;
    esac
}

# Main loop
while true; do
    show_menu
    process_choice
    echo ""
    read -p "Press Enter to continue..."
done
