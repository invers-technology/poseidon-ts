import { F, HALF_F, constants } from "./constants";
import { pow5, mix } from "./operation";
import { validateInputs } from "./validation";
export { randomFieldElement, P } from "./ff";

const MAX_INPUTS = 16;

export const poseidon = (inputs: string[] | number[] | bigint[]): bigint => {
  const { length } = inputs;

  if (length > MAX_INPUTS) {
    const chunks: bigint[] = [];
    for (let start = 0; start < length; start += MAX_INPUTS) {
      chunks.push(poseidon(inputs.slice(start, start + MAX_INPUTS)));
    }
    return poseidon(chunks);
  }
  const t = length + 1;
  const { p, m, c } = constants[length];
  try {
    const circuitInputs = validateInputs(inputs);
    let state = [BigInt(0), ...circuitInputs];

    for (let i = 0; i < F + p; i++) {
      for (let j = 0; j < t; j++) {
        state[j] += c[i * t + j];
        if (j === 0 || i < HALF_F || i >= HALF_F + p) state[j] = pow5(state[j]);
      }
      state = mix(state, m);
    }
    return state[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
