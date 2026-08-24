const unavailable=()=>{throw new Error("Shared work-order storage is provided by the live portal deployment.")};
export const env={
  DB:{
    prepare(){return {bind(){return this},run:unavailable,all:unavailable,first:unavailable}},
    batch:unavailable,
  },
  BUCKET:{put:unavailable},
};
