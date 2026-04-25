import sys
import os
from PIL import Image

def remove_background(input_path, output_path, tolerance=45):
    try:
        img = Image.open(input_path).convert("RGBA")
    except Exception as e:
        print("Error opening:", e)
        return
        
    data = list(img.getdata())
    bg_color = data[0] # assume top left is the background
    bg_r, bg_g, bg_b, _ = bg_color
    
    new_data = []
    for r, g, b, a in data:
        dist = ((r - bg_r)**2 + (g - bg_g)**2 + (b - bg_b)**2)**0.5
        if dist < tolerance:
            new_data.append((r,g,b,0))       # totally transparent
        elif dist < tolerance + 25:
            alpha = int(((dist - tolerance) / 25) * 255)
            new_data.append((r,g,b,alpha))   # semi-transparent antialiased edge
        else:
            new_data.append((r,g,b,a))
            
    img.putdata(new_data)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    print("Masking executed and saved!")

remove_background("pistasien_compressed.jpg", "assets/images/logo.png")
