import re

def update_css(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace CSS Variables Definitions
    content = re.sub(
        r':root\s*\{[^}]+\}', 
        ''':root {
  --pistachio:       #7a9e4e;
  --pistachio-light: #b8cc8a;
  --pistachio-pale:  #e8f0d0;
  --shell:           #e8d99a;
  --shell-dark:      #c4a85a;
  --cream:           #faf8f2;
  --ink:             #1a1a14;
  --ink-mid:         #3d3d2e;
  --warm-gray:       #9a9888;
  --font-head:  'Cormorant', serif;
  --font-body:  'Montserrat', sans-serif;
  --ease-out3:  cubic-bezier(0.215, 0.61, 0.355, 1);
  --ease-expo:  cubic-bezier(0.19, 1, 0.22, 1);
  --nav-h: 80px;
}''', content, count=1)

    # 2. Variable Usage mappings
    replacements = {
        'var(--clr-dark)': 'var(--ink)',
        'var(--clr-stone)': 'var(--ink-mid)',
        'var(--clr-gold)': 'var(--shell-dark)',
        'var(--clr-gold-lt)': 'var(--shell)',
        'var(--clr-cream)': 'var(--cream)',
        'var(--clr-muted)': 'var(--warm-gray)',
        'rgba(28,25,23': 'rgba(26,26,20',
        'rgba(28, 25, 23': 'rgba(26, 26, 20',
        'rgba(202,138,4': 'rgba(196,168,90',
        'rgba(202, 138, 4': 'rgba(196, 168, 90',
        'rgba(250,250,249': 'rgba(250,248,242',
        'rgba(250, 250, 249': 'rgba(250, 248, 242',
        '#7a9e4e': 'var(--pistachio)',
        'rgba(122,158,78': 'rgba(122, 158, 78',
        'rgba(122, 158, 78, 0.6)': 'rgba(122, 158, 78, 0.6)',
        '#1C1917': 'var(--ink)',
        '#CA8A04': 'var(--shell-dark)',
        '#FAFAF9': 'var(--cream)'
    }

    for old, new in replacements.items():
        content = content.replace(old, new)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_css(r'c:\Users\Administrator\Desktop\frontend\css\style.css')
