<script lang="ts">
	interface HeaderProps {
		isAuth: boolean;
	}

	let { isAuth }: HeaderProps = $props();
</script>

<header>
	<nav class="flex justify-between p-5">
		<div>white-shadow</div>
		<div>
			<ul>
				{#if !isAuth}
					<li>
						<a href="/auth">login</a>
					</li>
				{:else}
					<li>
						<form action="/auth/logout" method="POST">
							<button type="submit">Log out</button>
						</form>
					</li>
				{/if}
			</ul>
		</div>
	</nav>
</header>
