import { buildPoseidon } from "circomlibjs";
import { poseidon, randomFieldElement } from "../src";

describe("poseidon library tests", () => {
  const getRandomInputs = (length: number) => {
    return Array.from({ length: 1 }, () => [
      Array.from({ length }, () => randomFieldElement()),
    ]);
  };

  const testPoseidon = async (inputs: bigint[]) => {
    const circomPoseidon = await buildPoseidon();
    const { F } = circomPoseidon;
    const hash = circomPoseidon(inputs);
    const hash2 = poseidon(inputs);

    expect(F.toObject(hash)).toBe(hash2);
  };

  for (let i = 1; i <= 16; i++) {
    test.each(getRandomInputs(i))(
      `should work with variable inputs ${i}`,
      testPoseidon,
    );
  }

  it("should recursively hash inputs longer than 16", async () => {
    const circomPoseidon = await buildPoseidon();
    const { F } = circomPoseidon;
    const inputs = Array.from({ length: 39 }, () => randomFieldElement());
    const chunks = [
      F.toObject(circomPoseidon(inputs.slice(0, 16))),
      F.toObject(circomPoseidon(inputs.slice(16, 32))),
      F.toObject(circomPoseidon(inputs.slice(32, 39))),
    ];
    const expected = F.toObject(circomPoseidon(chunks));

    expect(poseidon(inputs)).toBe(expected);
  });
});
