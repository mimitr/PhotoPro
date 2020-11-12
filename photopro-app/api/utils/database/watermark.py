from PIL import Image, ImageDraw, ImageFont
import io

def apply_watermark(input):
    photo = Image.open(input).convert('RGBA')
    w, h = photo.size

    # Create semi-transparent watermark text image
    watermark = Image.new('RGBA', photo.size, (255,255,255,0))

    #Calculate font size based on image dimensions
    fontsize = int(h * 0.1875)
    fontsize = int(fontsize / 3)

    # Setting up watermark
    #wfont = ImageFont.load_default() # ImageFont.truetype("arial.ttf", 24)
    wfont = ImageFont.truetype("utils/database/Ubuntu-Title.ttf", fontsize, encoding = "unic")
    wtxt = "PhotoPro Copyright"
    wmdraw = ImageDraw.Draw(watermark)

    x = w/2
    y = h/2

    # Draw watermark image and paste over base photo
    wmdraw.text((x,y), wtxt, font=wfont, fill=(255,255,255,128))
    outphoto = Image.alpha_composite(photo, watermark)
    outphoto_rgb = outphoto.convert('RGB')
    photo.close()

    # save watermarked photo
    buffer = io.BytesIO()
    outphoto_rgb.save(buffer, format="JPEG")
    return buffer
