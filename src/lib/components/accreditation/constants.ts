export const onboardingSteps = [
    {
        key: 'institution-type',
        title: 'Institution Type',
        description: 'Select the type of institution you are registering for accreditation.',
        fields: ['Provider Type'],
    },
    {
        key: 'institution-details',
        title: 'Institution Details',
        description: 'Enter the basic identification details of your institution.',
        fields: ['Name of Institution', 'Institution Type', 'P.O Box', 'Email', 'Phone Number'],
    },
    {
        key: 'address-information',
        title: 'Address Information',
        description: 'Provide the official physical and postal address of the institution.',
        fields: ['Province', 'District', 'Sector', 'Cell', 'Village', 'Address Line'],
    },
    {
        key: 'about-the-institution',
        title: 'About the Institution',
        description: 'Give a brief overview of the institution and its services.',
        fields: ['Institution Summary', 'Mission or Mandate', 'Programs Offered'],
    },
    {
        key: 'legal-representatives',
        title: 'Legal Representatives',
        description: 'Add details of the person or people legally representing the institution.',
        fields: ['Representative Name', 'Role or Title', 'Email Address', 'Phone Number'],
    },
    {
        key: 'review-application',
        title: 'Review Application',
        description: 'Review the information provided before submitting your application.',
        fields: [],
    },
] as const;

export type OnboardingStepKey = (typeof onboardingSteps)[number]['key'];
