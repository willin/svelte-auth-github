<script>
  import { goto } from '$app/navigation';

  let { data } = $props();

  $effect(() => {
    if (data.user && data.user.invalid) {
      goto('/');
    }
  });
</script>

{#if data && !data.user.invalid}
  <div style="max-width:600px;word-break: break-all;">
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
{/if}
