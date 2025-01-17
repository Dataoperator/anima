export class Complex {
    constructor(
        public readonly re: number,
        public readonly im: number
    ) {}

    multiply(other: Complex): Complex {
        return new Complex(
            this.re * other.re - this.im * other.im,
            this.re * other.im + this.im * other.re
        );
    }

    add(other: Complex): Complex {
        return new Complex(
            this.re + other.re,
            this.im + other.im
        );
    }

    subtract(other: Complex): Complex {
        return new Complex(
            this.re - other.re,
            this.im - other.im
        );
    }

    abs(): number {
        return Math.sqrt(this.re * this.re + this.im * this.im);
    }

    phase(): number {
        return Math.atan2(this.im, this.re);
    }

    conjugate(): Complex {
        return new Complex(this.re, -this.im);
    }

    static fromPolar(r: number, phi: number): Complex {
        return new Complex(
            r * Math.cos(phi),
            r * Math.sin(phi)
        );
    }
}

export type Vector = {
    x: number;
    y: number;
    z: number;
}

export type Matrix3x3 = number[][];