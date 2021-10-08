const candyMachine = {
  status: {
    name: "node",
    count: 5,
  },
  getcandy() {
    this.status.count--;
    return this.status.count;
  },
};
const {
  getCandy,
  status: { count },
} = candyMachine;
console.log(candyMachine.getcandy());
