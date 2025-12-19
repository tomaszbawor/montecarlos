import { UniformDistribution } from "@/lib/distribution/UniformDistribution";

describe("UniformDistribution", () => {
  let uniform: UniformDistribution;

  beforeEach(() => {
    uniform = new UniformDistribution();
  });

  it("should return a number within the specified range", () => {
    const min = 5;
    const max = 10;

    for (let i = 0; i < 100; i++) {
      const value = uniform.calculateDistribution({ min, max });
      expect(value).toBeGreaterThanOrEqual(min);
      expect(value).toBeLessThanOrEqual(max);
    }
  });

  it("should return the min value when min and max are equal", () => {
    const min = 7;
    const max = 7;
    const value = uniform.calculateDistribution({ min, max });
    expect(value).toBe(min);
  });

  it("should return different values over multiple calls (likely non-deterministic)", () => {
    const min = 0;
    const max = 1;
    const values = new Set();

    for (let i = 0; i < 50; i++) {
      values.add(uniform.calculateDistribution({ min, max }));
    }
    expect(values.size).toBeGreaterThan(1);
  });

  it("should handle negative ranges correctly", () => {
    const min = -5;
    const max = -1;

    for (let i = 0; i < 100; i++) {
      const value = uniform.calculateDistribution({ min, max });
      expect(value).toBeGreaterThanOrEqual(min);
      expect(value).toBeLessThanOrEqual(max);
    }
  });
});
