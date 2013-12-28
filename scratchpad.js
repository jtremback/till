function kringle () {
  function poo () {
    console.log(arguments);
  }

  var args = Array.prototype.slice.call(arguments, 0);

  args.push('wankle');

  poo(args);
  poo.apply(this, args);
}





kringle('hoopla', 'excellent', 'whallop', 'callback', 'crokpot');