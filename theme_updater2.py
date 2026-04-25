import re

def update_css(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # The previous script mapped:
    # gold -> shell-dark
    # gold-lt -> shell
    # But the user specifically tagged:
    # --pistachio (primary green)
    # --pistachio-light (hover / accent)
    # So we need to re-map the old usages.
    # The current css file has `var(--shell-dark)` where it USED to have `var(--clr-gold)`.
    # And it has `var(--shell)` where it USED to have `var(--clr-gold-lt)`.
    # We should map these to `--pistachio` and `--pistachio-light`.

    # Let's replace the usages of those variables.
    replacements = {
        'var(--shell-dark)': 'var(--pistachio)',
        'var(--shell)': 'var(--pistachio-light)',
        'rgba(196,168,90': 'rgba(122, 158, 78', # rgb of shell-dark -> rgb of pistachio
        'rgba(196, 168, 90': 'rgba(122, 158, 78',
    }

    for old, new in replacements.items():
        content = content.replace(old, new)
        
    # Wait, --shell-dark: #c4a85a (borders / dark gold).
    # Some borders might need to actually be shell-dark. 
    # But since the user wants Pistachio as "primary green", the old "primary gold" should be "primary green".
    # I will replace all instances of var(--shell-dark) with var(--pistachio).

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_css(r'c:\Users\Administrator\Desktop\frontend\css\style.css')
