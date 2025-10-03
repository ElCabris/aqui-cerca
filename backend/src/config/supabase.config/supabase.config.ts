import { registerAs } from '@nestjs/config';

export default registerAs('supabase', () => {
	const url = process.env.SUPABASE_URL;
	const key = process.env.SUPABASE_KEY;
	const bcryptSaltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');

	if (!url || !key) {
		throw new Error(
			'Supabase configuration is missing. Please check SUPABASE_URL and SUPABASE_KEY environment variables.',
		);
	}

	return {
		url,
		key,
		bcryptSaltRounds,
	};
});
