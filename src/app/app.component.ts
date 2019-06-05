import {Component, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {interval} from 'rxjs';
import {fromEvent} from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  time = 0;
  timer = '00: 00: 00';
  settingTime;


  ngOnInit() {
   const startClick = fromEvent(document.getElementById('start'), 'click'),
         waitClick = fromEvent(document.getElementById('wait'), 'click'),
         resetClick = fromEvent(document.getElementById('reset'), 'click');
    let start = true,
        wait = true;

      startClick.subscribe(() => {

        if (start) {
          start = false;

          resetClick.subscribe(() => {
            this.time = 0;
            this.timer = this.secondsToTimerTime();
          });

          waitClick.subscribe(()  => {
            if (wait) {
              console.log('wait');
              wait = false;
            } else {
              wait = true;
              interval(1000)
                .pipe(takeUntil(waitClick))
                .pipe(takeUntil(resetClick))
                .pipe(takeUntil(startClick))
                .subscribe(() => {
                  --this.time;
                  this.timer = this.secondsToTimerTime();
                });
            }
          });

          interval(1000)
            .pipe(takeUntil(waitClick))
            .pipe(takeUntil(resetClick))
            .pipe(takeUntil(startClick))
            .subscribe(  () => {
              --this.time;
              this.timer = this.secondsToTimerTime();
            });

        } else {
          start = true;
          this.time = this.settingTime;
          this.timer = this.secondsToTimerTime();
        }
      });
  }

  public secondsToTimerTime() {
   return new Date(this.time * 1000).toISOString().substr(11, 8);
  }

  public setTime(hours, minutes, seconds) {
    this.time = +seconds + +minutes * 60 + +hours * 60 * 60;
    if (this.time <= 0) {
      alert(`Кто-то ввел непрвильную циферку ! Время не может быть отрицателным или нулем!`);
    } else {
      this.settingTime = this.time;
      this.timer = this.secondsToTimerTime();
    }
  }
}
