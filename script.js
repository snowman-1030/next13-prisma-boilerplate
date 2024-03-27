let interval;
let interval1;
$(document).ready(() => {
  $(
    document.addEventListener("keydown", (event) => {
      clearInterval(interval);
      clearInterval(interval1);
      if (event.which == 68) {
        $(".whell").css("transform", "rotate(80deg)");
      }
      if (event.which == 65) {
        $(".whell").css("transform", "rotate(-80deg)");
      }
      if (event.which == 68) {
        x;
        $(".whell").css("transform", "rotate(80deg)");
      }
      if (event.which == 87) {
        let temp = $(".counter").html();
        $(".counter").html(+temp + 1);
      }
      if (event.which == 83) {
        let temp;
        interval1 = setInterval(() => {
          temp = $(".counter").html();
          if (temp > 0) {
            $(".counter").html(temp - 1);
          }
          if (temp == 0) {
            clearInterval(interval1);
          }
        }, 10);
      }
    })
  );
  $(
    document.addEventListener("keyup", (event) => {
      $(".whell").css("transform", "rotate(0deg)");
      $(".whell").css("transform", "rotate(0deg)");
      let temp;
      interval = setInterval(() => {
        temp = +$(".counter").html();
        if (temp > 0) {
          $(".counter").html(temp - 1);
        }
        if (temp == 0) {
          clearInterval(interval);
        }
      }, 50);
    })
  );
});
