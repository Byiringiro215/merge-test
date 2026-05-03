<script lang='ts'>
    import FormTextarea from '../form-fields/FormTextarea.svelte';

    interface Props {
        fields: readonly string[];
        aboutText: Record<string, string>;
        setAboutText: (text: Record<string, string>) => void;
    }

    const { fields, aboutText, setAboutText }: Props = $props();
</script>

<div class='flex flex-col space-y-6'>
    {#each fields as field (field)}
        <FormTextarea
            label={field}
            value={aboutText[field] ?? ''}
            onChange={v => setAboutText({ ...aboutText, [field]: v })}
            maxLength={275}
            placeholder="Describe the institution's mission, programs, and key highlights..."
        />
    {/each}
</div>
