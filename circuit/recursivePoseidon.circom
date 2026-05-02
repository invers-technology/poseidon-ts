pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";

template RecursivePoseidon39() {
    signal input inputs[39];
    signal output out;

    component chunk0 = Poseidon(16);
    component chunk1 = Poseidon(16);
    component chunk2 = Poseidon(7);
    component root = Poseidon(3);

    for (var i = 0; i < 16; i++) {
        chunk0.inputs[i] <== inputs[i];
        chunk1.inputs[i] <== inputs[i + 16];
    }

    for (var i = 0; i < 7; i++) {
        chunk2.inputs[i] <== inputs[i + 32];
    }

    root.inputs[0] <== chunk0.out;
    root.inputs[1] <== chunk1.out;
    root.inputs[2] <== chunk2.out;

    out <== root.out;
}

component main = RecursivePoseidon39();
