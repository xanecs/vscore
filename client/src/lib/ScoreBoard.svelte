<script lang="ts">
  import { quintOut } from 'svelte/easing';
  import { crossfade, fly } from 'svelte/transition';
  import { state } from './stores';
  import { currentScore, setScore } from './utils';
  const [send, receive] = crossfade({
    duration: d => Math.sqrt(d * 300),

    fallback(node, params) {
      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;

      return {
        duration: 600,
        easing: quintOut,
        css: t => `
          transform: ${transform} scale(${t});
          opacity: ${t}
        `
      };
    }
  })
  let score = [0, 0];
  let sets = [0, 0];
  $: {
    score = currentScore($state.state.sets)
    sets = setScore($state.state.sets)
  }
</script>

<main>
  <div class="top">
    <div class="score-table">
      <div class="col color">
        <div class="heim" style="background-color: {$state.state.teamColors[0]};"></div>
        <div class="gast" style="background-color: {$state.state.teamColors[1]};"></div>
      </div>
      <div class="col team">
        <div class="heim">{$state.state.teamNames[0]}
          {#if $state.state.serving === 0}
            <div in:receive="{{key: 'serving'}}" out:send="{{key: 'serving'}}" class="serving"></div>
          {/if}
        </div>
        <div class="gast">{$state.state.teamNames[1]}
          {#if $state.state.serving === 1}
            <div in:receive="{{key: 'serving'}}" out:send="{{key: 'serving'}}" class="serving"></div>
          {/if}
        </div>
      </div>
      <div class="col satz">
        {#key sets[0]}
        <div class="heim" in:fly={{x: -10}}>{sets[0]}</div>
        {/key}
        {#key sets[1]}
        <div class="gast" in:fly={{x: -10}}>{sets[1]}</div>
        {/key}
      </div>
      <div class="col score" class:wide={score[0] > 9 || score[1] > 9}>
        {#key score[0]}
        <div class="heim" in:fly={{x: -10}}>{score[0]}</div>
        {/key}
        {#key score[1]}
        <div class="gast" in:fly={{x: -10}}>{score[1]}</div>
        {/key}
      </div>
    </div>
  </div>
</main>

<style type="text/css">
main {
  font-family: 'Menlo';
}

.top {
  display: flex;
}

.score-table {
  margin-left: 25px;
  margin-top: 25px;
  display: flex;
  flex-direction: row;
  background:  linear-gradient(0deg, #ddd, #fff, #fff, #ddd);
  color:  black;
  font-size: 20px;
  border-radius:  4px;
  border: 2px solid #bbb;
  transition: width 0.5s;
}

.team {
  border-right: 2px solid #999;
  padding-right: 5px;
}

.team > div {
  position: relative;
  width: 100%;
  padding-right: 20px;
  box-sizing: border-box;
}

.serving {
  background: #666;
  width: 12px;
  height: 12px;
  position: absolute;
  right: 7px;
  top: 6px;
  border-radius: 50%;
}

.satz {
  margin-left: 7px;
  color: #666;
}

.score {
  margin: 0 7px;
  font-weight: bold;
  width: 25px;
  text-align: right;
  transition: width 0.5s ease;
}

.score.wide {
  width: 35px;
}

.col {
  display: flex;
  flex-direction: column;
}

.col > div {
  margin: 5px;
  height: 27px;
}

.color > div {
  width: 8px;
  border-radius: 3px;
}

.team {
  font-family: 'Helvetica Neue';
}
</style>