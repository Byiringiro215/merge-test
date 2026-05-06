<script lang='ts'>
    import CertificateAccessContent from '$lib/accreditation/features/certificates/components/CertificateAccessContent.svelte';
    import PageContainer from '$lib/components/accreditation/layout/PageContainer.svelte';
    import RoleGuard from '$lib/components/accreditation/layout/RoleGuard.svelte';
</script>

<RoleGuard allowedRoles={['supervisor', 'super-admin']}>
    <PageContainer
        title='Certificate Access Management'
        description='Grant certificate access to approved applications'
    >
        <CertificateAccessContent />
    </PageContainer>
</RoleGuard>
