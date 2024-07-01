<script lang="ts">
	interface HeaderProps {
		isAuth: boolean;
	}

	let { isAuth }: HeaderProps = $props();
</script>

<header class="sticky top-0">
	<nav class="flex justify-between p-5">
		<div>white-shadow</div>
		<div>
			<ul class="flex gap-5">
				{#if !isAuth}
					<li>
						<a href="/auth">login</a>
					</li>
				{:else}
					<li>
						<a href="/workspaces">Working</a>
					</li>
					<li>
						<a href="/workspaces">My Workspaces</a>
					</li>
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
