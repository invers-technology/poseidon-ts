import { poseidon, randomFieldElement } from "../src";
import path from "path";
const wasm = require("circom_tester").wasm;

jest.setTimeout(30000);

describe("poseidon circuit tests", () => {
  const inputs = [1n, 2n];

  it("should work with circuit", async () => {
    const circuit = await wasm(path.join("circuit", "poseidon.circom"), {
      include: path.join("node_modules"),
    });
    const witness = await circuit.calculateWitness({ inputs });
    const hash = poseidon(inputs);

    await circuit.checkConstraints(witness);
    await circuit.assertOut(witness, { out: hash });
  });

  it("should work with 39 inputs recursive circuit", async () => {
    const recursiveInputs = Array.from({ length: 39 }, () =>
      randomFieldElement(),
    );
    const circuit = await wasm(
      path.join("circuit", "recursivePoseidon.circom"),
      { include: path.join("node_modules") },
    );
    const witness = await circuit.calculateWitness({
      inputs: recursiveInputs,
    });
    const chunks = [
      poseidon(recursiveInputs.slice(0, 16)),
      poseidon(recursiveInputs.slice(16, 32)),
      poseidon(recursiveInputs.slice(32, 39)),
    ];
    const hash = poseidon(chunks);

    await circuit.checkConstraints(witness);
    await circuit.assertOut(witness, { out: hash });
    expect(poseidon(recursiveInputs)).toEqual(hash);
  });
});
