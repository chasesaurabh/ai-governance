#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# AI Governance Framework — Installer
# ============================================================================
# One-command onboarding for any project.
#
# Usage:
#   From a local clone:
#     ./install.sh                        # Install to current directory
#     ./install.sh /path/to/my-project    # Install to specific project
#
#   From GitHub (no clone needed):
#     curl -sL https://raw.githubusercontent.com/chasesaurabh/ai-governance/main/install.sh | bash
#     curl -sL https://raw.githubusercontent.com/chasesaurabh/ai-governance/main/install.sh | bash -s -- /path/to/project
#
#   Non-interactive (CI/automation):
#     ./install.sh --all /path/to/project           # Install all adapters
#     ./install.sh --tools windsurf,cursor /path     # Install specific adapters
#     ./install.sh --core-only /path                 # Core policies only, no adapters
# ============================================================================

VERSION="1.1.0"
REPO_URL="https://github.com/chasesaurabh/ai-governance"
BRANCH="main"

# Colors (disable if not a terminal)
if [ -t 1 ]; then
  GREEN='\033[0;32m'
  BLUE='\033[0;34m'
  YELLOW='\033[1;33m'
  RED='\033[0;31m'
  BOLD='\033[1m'
  NC='\033[0m'
else
  GREEN='' BLUE='' YELLOW='' RED='' BOLD='' NC=''
fi

# ── Helpers ──────────────────────────────────────────────────────────────────

info()    { echo -e "${BLUE}ℹ${NC}  $1"; }
success() { echo -e "${GREEN}✓${NC}  $1"; }
warn()    { echo -e "${YELLOW}⚠${NC}  $1"; }
error()   { echo -e "${RED}✗${NC}  $1" >&2; }
header()  { echo -e "\n${BOLD}$1${NC}"; }

usage() {
  cat <<EOF
${BOLD}AI Governance Framework Installer v${VERSION}${NC}

${BOLD}Usage:${NC}
  ./install.sh [options] [target-directory]

${BOLD}Options:${NC}
  --all              Install all AI tool adapters
  --core-only        Install core policies only (no adapters)
  --tools LIST       Comma-separated list of tools to install
                     Options: windsurf, cursor, copilot, claude, aider
  --force            Overwrite existing files without prompting
  --help             Show this help message

${BOLD}Examples:${NC}
  ./install.sh                              # Interactive, install to current dir
  ./install.sh /path/to/project             # Interactive, install to target dir
  ./install.sh --all .                      # All adapters, current dir
  ./install.sh --tools windsurf,cursor .    # Windsurf + Cursor only

${BOLD}What gets installed:${NC}
  Core (always):
    ai-governance/         17 policies, 7 templates, KPIs, router, self-alignment
    GOVERNANCE-MATRIX.md   Tool compatibility matrix

  Adapters (you choose):
    Windsurf    .windsurfrules + .windsurf/workflows/ (10 workflows)
    Cursor      .cursorrules + .cursor/rules/governance.md
    Copilot     .github/copilot-instructions.md
    Claude Code CLAUDE.md
    Aider       .aider/conventions.md
EOF
  exit 0
}

# ── Parse Arguments ──────────────────────────────────────────────────────────

TARGET_DIR=""
INSTALL_ALL=false
CORE_ONLY=false
FORCE=false
TOOLS_LIST=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --all)       INSTALL_ALL=true; shift ;;
    --core-only) CORE_ONLY=true; shift ;;
    --force)     FORCE=true; shift ;;
    --tools)     TOOLS_LIST="$2"; shift 2 ;;
    --help|-h)   usage ;;
    -*)          error "Unknown option: $1"; usage ;;
    *)           TARGET_DIR="$1"; shift ;;
  esac
done

# ── Determine Source and Target ──────────────────────────────────────────────

# Find the source (where this script lives = governance repo)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"

# If source doesn't have ai-governance/, we need to clone
NEED_CLONE=false
if [ ! -d "$SCRIPT_DIR/ai-governance" ]; then
  NEED_CLONE=true
fi

# Determine target directory
if [ -z "$TARGET_DIR" ]; then
  # If running from pipe (curl), use current directory
  if [ "$NEED_CLONE" = true ]; then
    TARGET_DIR="$(pwd)"
  else
    # Running from clone — ask for target or use current dir
    echo ""
    header "AI Governance Framework Installer v${VERSION}"
    echo ""
    read -rp "Target project directory [$(pwd)]: " input_dir
    TARGET_DIR="${input_dir:-$(pwd)}"
  fi
fi

# Resolve to absolute path
TARGET_DIR="$(cd "$TARGET_DIR" 2>/dev/null && pwd)" || {
  error "Directory does not exist: $TARGET_DIR"
  exit 1
}

# Don't install into the governance repo itself
if [ "$TARGET_DIR" = "$SCRIPT_DIR" ] && [ "$NEED_CLONE" = false ]; then
  error "Cannot install into the governance repo itself."
  error "Provide a target project directory: ./install.sh /path/to/your-project"
  exit 1
fi

# ── Clone if needed (curl pipe mode) ────────────────────────────────────────

TEMP_DIR=""
if [ "$NEED_CLONE" = true ]; then
  info "Downloading AI Governance Framework..."
  TEMP_DIR="$(mktemp -d)"
  trap 'rm -rf "$TEMP_DIR"' EXIT
  git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$TEMP_DIR" 2>/dev/null || {
    error "Failed to clone from $REPO_URL"
    error "Update REPO_URL in install.sh or use the local clone method."
    exit 1
  }
  SCRIPT_DIR="$TEMP_DIR"
  success "Downloaded governance framework"
fi

# ── Display Banner ───────────────────────────────────────────────────────────

echo ""
header "═══════════════════════════════════════════════════"
header "  AI Governance Framework Installer v${VERSION}"
header "═══════════════════════════════════════════════════"
echo ""
info "Source:  $SCRIPT_DIR"
info "Target:  $TARGET_DIR"
echo ""

# ── Select AI Tools ──────────────────────────────────────────────────────────

SELECTED_TOOLS=()

if [ "$CORE_ONLY" = true ]; then
  info "Core-only mode: no adapters will be installed"
elif [ "$INSTALL_ALL" = true ]; then
  SELECTED_TOOLS=("windsurf" "cursor" "copilot" "claude" "aider")
  info "Installing all adapters: ${SELECTED_TOOLS[*]}"
elif [ -n "$TOOLS_LIST" ]; then
  IFS=',' read -ra SELECTED_TOOLS <<< "$TOOLS_LIST"
  info "Installing adapters: ${SELECTED_TOOLS[*]}"
else
  # Interactive selection
  header "Which AI coding tools do you use?"
  echo ""
  echo "  1) Windsurf (Cascade)       — .windsurfrules + workflows"
  echo "  2) Cursor                   — .cursorrules + rules"
  echo "  3) GitHub Copilot           — copilot-instructions.md"
  echo "  4) Claude Code              — CLAUDE.md"
  echo "  5) Aider                    — conventions.md"
  echo "  6) All of the above"
  echo ""
  read -rp "Enter numbers separated by spaces (e.g., 1 3 4): " choices

  for choice in $choices; do
    case "$choice" in
      1) SELECTED_TOOLS+=("windsurf") ;;
      2) SELECTED_TOOLS+=("cursor") ;;
      3) SELECTED_TOOLS+=("copilot") ;;
      4) SELECTED_TOOLS+=("claude") ;;
      5) SELECTED_TOOLS+=("aider") ;;
      6) SELECTED_TOOLS=("windsurf" "cursor" "copilot" "claude" "aider"); break ;;
      *) warn "Ignoring unknown option: $choice" ;;
    esac
  done

  if [ ${#SELECTED_TOOLS[@]} -eq 0 ]; then
    warn "No tools selected. Installing core only."
  fi
fi

# ── Copy Helper ──────────────────────────────────────────────────────────────

copy_file() {
  local src="$1"
  local dest="$2"

  if [ ! -f "$src" ]; then
    warn "Source not found: $src (skipping)"
    return
  fi

  # Create parent directory
  mkdir -p "$(dirname "$dest")"

  if [ -f "$dest" ] && [ "$FORCE" != true ]; then
    # Check if files differ
    if diff -q "$src" "$dest" >/dev/null 2>&1; then
      echo "  · $(basename "$dest") (already up to date)"
      return
    fi
    warn "$(basename "$dest") already exists and differs"
    if [ -t 0 ]; then
      read -rp "    Overwrite? [y/N/d(iff)]: " answer
      case "$answer" in
        y|Y) ;;
        d|D) diff --color=auto "$dest" "$src" || true; read -rp "    Overwrite? [y/N]: " answer2; [[ "$answer2" =~ ^[yY]$ ]] || return ;;
        *)   echo "  · $(basename "$dest") (kept existing)"; return ;;
      esac
    else
      echo "  · $(basename "$dest") (kept existing — use --force to overwrite)"
      return
    fi
  fi

  cp "$src" "$dest"
  success "$(basename "$dest")"
}

copy_dir() {
  local src="$1"
  local dest="$2"

  if [ ! -d "$src" ]; then
    warn "Source directory not found: $src"
    return
  fi

  if [ -d "$dest" ] && [ "$FORCE" != true ]; then
    warn "Directory $dest already exists — merging (new files only)"
    # Use rsync if available, otherwise cp
    if command -v rsync >/dev/null 2>&1; then
      rsync -a --ignore-existing "$src/" "$dest/"
    else
      cp -rn "$src/." "$dest/" 2>/dev/null || cp -r "$src/." "$dest/"
    fi
    success "$(basename "$dest")/ (merged)"
  else
    mkdir -p "$(dirname "$dest")"
    cp -r "$src" "$dest"
    success "$(basename "$dest")/"
  fi
}

# ── Install Core ─────────────────────────────────────────────────────────────

header "Installing Core Governance..."
echo ""

copy_dir "$SCRIPT_DIR/ai-governance" "$TARGET_DIR/ai-governance"
copy_file "$SCRIPT_DIR/GOVERNANCE-MATRIX.md" "$TARGET_DIR/GOVERNANCE-MATRIX.md"

echo ""
success "Core installed (17 policies, 7 templates, KPIs, router, self-alignment)"

# ── Install Adapters ─────────────────────────────────────────────────────────

if [ "${#SELECTED_TOOLS[@]}" -gt 0 ] 2>/dev/null; then
  header "Installing Adapters..."
  echo ""

  for tool in "${SELECTED_TOOLS[@]}"; do
    case "$tool" in
      windsurf)
        info "Windsurf (Cascade)..."
        copy_file "$SCRIPT_DIR/.windsurfrules" "$TARGET_DIR/.windsurfrules"
        copy_dir "$SCRIPT_DIR/.windsurf" "$TARGET_DIR/.windsurf"
        ;;
      cursor)
        info "Cursor..."
        copy_file "$SCRIPT_DIR/.cursorrules" "$TARGET_DIR/.cursorrules"
        copy_dir "$SCRIPT_DIR/.cursor" "$TARGET_DIR/.cursor"
        ;;
      copilot)
        info "GitHub Copilot..."
        copy_file "$SCRIPT_DIR/.github/copilot-instructions.md" "$TARGET_DIR/.github/copilot-instructions.md"
        ;;
      claude)
        info "Claude Code..."
        copy_file "$SCRIPT_DIR/CLAUDE.md" "$TARGET_DIR/CLAUDE.md"
        ;;
      aider)
        info "Aider..."
        copy_dir "$SCRIPT_DIR/.aider" "$TARGET_DIR/.aider"
        ;;
      *)
        warn "Unknown tool: $tool (skipping)"
        ;;
    esac
  done

  echo ""
  success "Adapters installed for: ${SELECTED_TOOLS[*]:-}"
fi

# ── Post-Install Summary ────────────────────────────────────────────────────

echo ""
header "═══════════════════════════════════════════════════"
header "  Installation Complete!"
header "═══════════════════════════════════════════════════"
echo ""

info "What was installed:"
echo "  · ai-governance/policies/    — 17 enforceable policies"
echo "  · ai-governance/templates/   — 7 governance templates"
echo "  · ai-governance/router/      — Auto-router + self-alignment"
echo "  · ai-governance/kpis/        — Measurable targets"
echo "  · GOVERNANCE-MATRIX.md       — Tool compatibility matrix"

if [ "${#SELECTED_TOOLS[@]}" -gt 0 ] 2>/dev/null; then
  echo ""
  info "Adapters installed:"
  for tool in "${SELECTED_TOOLS[@]}"; do
    case "$tool" in
      windsurf) echo "  · Windsurf: .windsurfrules + .windsurf/workflows/ (10 workflows)" ;;
      cursor)   echo "  · Cursor: .cursorrules + .cursor/rules/governance.md" ;;
      copilot)  echo "  · Copilot: .github/copilot-instructions.md" ;;
      claude)   echo "  · Claude Code: CLAUDE.md" ;;
      aider)    echo "  · Aider: .aider/conventions.md" ;;
    esac
  done
fi

echo ""
header "Next Steps:"
echo ""
echo "  1. ${BOLD}Start using your AI tool${NC} — governance is auto-loaded!"
echo "     The auto-router detects intent from your prompts and triggers"
echo "     the right governance workflow. No setup needed."
echo ""
echo "  2. ${BOLD}Customize policies${NC} (optional)"
echo "     Edit files in ai-governance/policies/ to match your org's standards."
echo ""
echo "  3. ${BOLD}Set up CI enforcement${NC} (recommended)"
echo "     See GOVERNANCE-MATRIX.md for CI/CD integration guidance."
echo ""
echo "  4. ${BOLD}Commit the governance files${NC}"
echo "     git add ai-governance/ GOVERNANCE-MATRIX.md"

if [ "${#SELECTED_TOOLS[@]}" -gt 0 ] 2>/dev/null; then
  for tool in "${SELECTED_TOOLS[@]}"; do
    case "$tool" in
      windsurf) echo "     git add .windsurfrules .windsurf/" ;;
      cursor)   echo "     git add .cursorrules .cursor/" ;;
      copilot)  echo "     git add .github/copilot-instructions.md" ;;
      claude)   echo "     git add CLAUDE.md" ;;
      aider)    echo "     git add .aider/" ;;
    esac
  done
fi

echo '     git commit -m "chore: add AI governance framework"'
echo ""
info "Full documentation: ai-governance/INDEX.md"
info "Questions? Open an issue at ${REPO_URL}"
echo ""
