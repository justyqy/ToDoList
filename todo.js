//存取localStorage中的数据
var store = {
  save(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  fetch(key) {
    return JSON.parse(window.localStorage.getItem(key)) || [];
  },
};
//list取出所有的值
var list = store.fetch("storeData");

var vm = new Vue({
  el: ".main",
  data: {
    list,
    todo: "",
    edtorTodos: "", //记录正在编辑的数据,
    beforeTitle: "", //记录正在编辑的数据的title
    visibility: "all", //通过这个属性值的变化对数据进行筛选
    findList: [],
  },
  watch: {
    //下面的这种方法是浅监控
    /*list:function(){//监控list这个属性，当这个属性对应的值发生变化就会执行函数
        store.save("storeData",this.list);
    }*/
    //下面的是深度监控
    list: {
      handler: function () {
        store.save("storeData", this.list);
      },
      deep: true,
    },
  },
  methods: {
    enterFn(ev) {
      //添加任务
      //向list中添加一项任务
      //事件处理函数中的this指向的是当前这个根实例
      if (this.todo == "") {
        return;
      }
      this.list.push({
        title: this.todo,
        isComplete: false,
      });
      this.todo = "";
    },
    find(key) {
      // console.log(key);
      //先将数据重置，满足每次搜索都是从原始数据中进行搜索
      this.listDataInt = this.list;

      //利用vue的filter模糊搜索
      this.findList = this.listDataInt.filter(
        (item) => item.title.indexOf(key) >= 0
      );
      this.listDataInt = this.findList;
      // console.log(this.findList);
    },
    outfouse() {
      this.findList = [];
    },
    //点击列表，选择
    appClick: function (data) {

      this.todo = data.title
      // console.log(data)
      this.findList = [];
    },
    delFn(item) {
      //删除任务
      var index = this.list.indexOf(item);
      this.list.splice(index, 1);
    },
    edtorTodo(item) {
      //编辑任务
      //编辑任务的时候记录编辑之前的值
      this.beforeTitle = item.title;
      this.edtorTodos = item;
    },
    edtoEnd(item) {
      //编辑完成
      this.edtorTodos = "";
      // this.cancelEdit = this.edtorTodos;
    },
    cancelEdit(item) {
      //取消编辑
      item.title = this.beforeTitle;
      this.beforeTitle = "";
      this.edtorTodos = "";
    },
  },
  directives: {
    focus: {
      update(el, binding) {
        if (binding.value) {
          el.focus();
        }
      },
    },
  },
  computed: {
    unComplete() {
      return this.list.filter((item) => {
        return !item.isComplete;
      }).length;
    },
    filterData() {
      //过滤的时候有三种情况 all completed unCompleted
      var filter = {
        all: function (list) {
          return list;
        },
        completed: function (list) {
          return list.filter((item) => {
            return item.isComplete;
          });
        },
        unCompleted: function (list) {
          return list.filter((item) => {
            return !item.isComplete;
          });
        },
      };
      //如果找到了过滤函数，就返回过滤后的数据，如果没有找到就返回所有的数据
      return filter[this.visibility] ? filter[this.visibility](list) : list;
    },
  },
});

function hashFn() {
  var hash = window.location.hash.slice(1);
  vm.visibility = hash;
}
hashFn();
window.addEventListener("hashchange", hashFn);
