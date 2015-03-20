var _ = require("../lib/lodash.compat");

function Class() {}

Class.extend = function (proto) {
    var fn,
        member,
        that = this,
        Base = function () {},
        subclass = proto && proto.init ? proto.init : function () {
            that.apply(this, arguments);
        };

    Base.prototype = that.prototype;
    fn = subclass.fn = subclass.prototype = new Base();

    for (member in proto) {
        if (proto[member] !== null && proto[member].constructor === Object) {
            // Merge object members
            fn[member] = _.merge({}, Base.prototype[member]);
            fn[member] = _.merge(fn[member], proto[member]);
        } else {
            fn[member] = proto[member];
        }
    }

    fn.constructor = subclass;
    subclass.extend = that.extend;

    return subclass;
};

module.exports = Class;
