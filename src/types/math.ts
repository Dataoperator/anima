export interface Complex {
  real: number;
  imaginary: number;
}

export class ComplexNumber implements Complex {
  constructor(public real: number, public imaginary: number) {}

  static fromPolar(r: number, theta: number): ComplexNumber {
    return new ComplexNumber(
      r * Math.cos(theta),
      r * Math.sin(theta)
    );
  }

  multiply(other: Complex): ComplexNumber {
    return new ComplexNumber(
      this.real * other.real - this.imaginary * other.imaginary,
      this.real * other.imaginary + this.imaginary * other.real
    );
  }

  add(other: Complex): ComplexNumber {
    return new ComplexNumber(
      this.real + other.real,
      this.imaginary + other.imaginary
    );
  }

  magnitude(): number {
    return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
  }

  phase(): number {
    return Math.atan2(this.imaginary, this.real);
  }

  conjugate(): ComplexNumber {
    return new ComplexNumber(this.real, -this.imaginary);
  }

  abs(): number {
    return this.magnitude();
  }
}