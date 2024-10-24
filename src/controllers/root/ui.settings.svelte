<script>
    let { value = $bindable({
        _id: Math.random().toString().slice(3, 10),
        id: "some-rule",
        type: "email",
        account: {
            host: "",
            port: 465,
            secure: true,
            auth: {
                user: "",
                pass: "",
            },
        },
        rules: {},
    }), readonly, disabled } = $props();
</script>

{#if value}
    <h5 class="title is-5">Аккаунт</h5>
    <div class="field is-horizontal">
        <div class="field-label">
            <label
                class="label"
                for="edit-sink-options-{value._id}-account-host">Сервер</label
            >
        </div>
        <div class="field-body">
            <div class="field">
                <p class="control is-narrow">
                    <input
                        class="input is-success"
                        id="edit-sink-options-{value._id}-account-host"
                        type="text"
                        placeholder="host"
                        bind:value={value.account.host}
                        {readonly}
                        {disabled}
                    />
                </p>
            </div>
            <div class="field">
                <p class="control is-narrow">
                    <input
                        class="input is-success"
                        type="text"
                        placeholder="port"
                        bind:value={value.account.port}
                        {readonly}
                        {disabled}
                    />
                </p>
            </div>
            <div class="field">
                <p class="control is-narrow">
                    <input
                        type="checkbox"
                        class="switch"
                        id="edit-sink-options-{value._id}-account-secure"
                        bind:checked={value.account.secure}
                        name="account.secure"
                        {readonly}
                        {disabled}
                    />
                    <label
                        class="label"
                        for="edit-sink-options-{value._id}-account-secure"
                        >Secure</label
                    >
                </p>
            </div>
        </div>
    </div>
    <div class="field is-horizontal">
        <div class="field-label">
            <label
                class="label"
                for="edit-sink-options-{value._id}-account-host"
                >Логин/пароль</label
            >
        </div>
        <div class="field-body">
            <div class="field">
                <p class="control is-narrow">
                    <input
                        class="input is-success"
                        id="edit-sink-options-{value._id}-account-user"
                        type="text"
                        placeholder="username"
                        bind:value={value.account.auth.user}
                        {readonly}
                        {disabled}
                    />
                </p>
            </div>
            <div class="field">
                <p class="control is-narrow">
                    <input
                        class="input is-success"
                        type="password"
                        placeholder="password"
                        bind:value={value.account.auth.pass}
                        {readonly}
                        {disabled}
                    />
                </p>
            </div>
        </div>
    </div>
{/if}
