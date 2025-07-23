import { onMount } from 'solid-js';

export default function AdRail() {
  onMount(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error(e);
    }
  });

  return (
    <ins
      class="adsbygoogle"
      style="display:inline-block;width:160px;height:600px"
      data-ad-client="ca-pub-5995460087390046"
      data-ad-slot="0000000000"
    />
  );
}
