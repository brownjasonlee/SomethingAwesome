#!/usr/bin/env python3
"""Simple ASCII Mandelbrot set generator."""


def mandelbrot(width=80, height=40, max_iter=30,
               x_min=-2.0, x_max=1.0, y_min=-1.0, y_max=1.0):
    chars = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/*tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"
    w_range = x_max - x_min
    h_range = y_max - y_min
    output = []
    for y in range(height):
        imaginary = y_min + (y / height) * h_range
        row = []
        for x in range(width):
            real = x_min + (x / width) * w_range
            c = complex(real, imaginary)
            z = 0j
            iteration = 0
            while abs(z) <= 2.0 and iteration < max_iter:
                z = z * z + c
                iteration += 1
            index = int(iteration / max_iter * (len(chars) - 1))
            row.append(chars[index])
        output.append("".join(row))
    return "\n".join(output)


def main():
    import argparse
    parser = argparse.ArgumentParser(description="ASCII Mandelbrot generator")
    parser.add_argument('--width', type=int, default=80,
                        help='Output width in characters')
    parser.add_argument('--height', type=int, default=40,
                        help='Output height in characters')
    parser.add_argument('--max-iter', type=int, default=30,
                        help='Maximum number of iterations')
    args = parser.parse_args()
    print(mandelbrot(args.width, args.height, args.max_iter))


if __name__ == '__main__':
    main()
