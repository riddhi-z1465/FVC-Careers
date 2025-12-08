from PIL import Image, ImageDraw, ImageFont
import os

# Create placeholder images for the gallery
colors = [
    ('#667EEA', 'Life at FVC - Workspace'),
    ('#764BA2', 'Life at FVC - Collaboration'),
    ('#F093FB', 'Life at FVC - Team Spirit'),
    ('#4FACFE', 'Life at FVC - Innovation'),
    ('#43E97B', 'Life at FVC - Culture'),
    ('#FA709A', 'Life at FVC - Community')
]

for i, (color, text) in enumerate(colors, 1):
    # Create image
    img = Image.new('RGB', (800, 600), color)
    draw = ImageDraw.Draw(img)
    
    # Add text
    try:
        font = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 40)
    except:
        font = ImageFont.load_default()
    
    # Calculate text position
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (800 - text_width) // 2
    y = (600 - text_height) // 2
    
    # Draw text with shadow
    draw.text((x+2, y+2), text, fill=(0, 0, 0), font=font)
    draw.text((x, y), text, fill=(255, 255, 255), font=font)
    
    # Save image
    img.save(f'life-{i}.jpg', 'JPEG', quality=95)
    print(f'Created life-{i}.jpg')

print('All placeholder images created successfully!')
