import io
from PIL import Image, ImageFilter, ImageOps

def decode_binary(binary):
    return Image.open(io.BytesIO(binary))

def encode_binary(image):
    image_binary = io.BytesIO()
    image.save(image_binary, format='JPEG')

    return image_binary.getvalue()  # Return the binary data

def pixelate(image, pixel_size=10):
    # Resize down and back up to create a pixelation effect
    small = image.resize(
        (image.size[0] // pixel_size, image.size[1] // pixel_size), resample=Image.BILINEAR)
    return small.resize(image.size, Image.NEAREST)

# Blur function
def blur(image, radius=5):
    return image.filter(ImageFilter.GaussianBlur(radius))

# Rotate function
def rotate(image, degrees=45):
    return image.rotate(degrees)

# Invert color function
def invert(image):
  return ImageOps.invert(image)
