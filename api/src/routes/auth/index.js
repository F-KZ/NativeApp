import { Router } from 'express';
import {
  createUserSchema,
  loginSchema,
  usersTable,
} from '../../db/usersSchema.js';
import { validateData } from '../../middlewares/validationMiddleware.js';
import bcrypt from 'bcryptjs';
import { db } from '../../db/index.js';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import validateEmail from '../../middlewares/validationEmail.js';

const router = Router();

const generateUserToken = (user) => {
  return jwt.sign({ userId: user.id, role: user.role }, 'your-secret', {
    expiresIn: '30d',
  });
};

router.post('/register', validateData(createUserSchema), async (req, res, next) => {
  // Transaction pour garantir l'intégrité des opérations
  try {
    const requiredFields = ['email', 'password', 'name', 'address'];
    const missingFields = requiredFields.filter(field => !req.cleanBody[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: 'Champs manquants', 
        missingFields,
        message: `Les champs suivants sont requis: ${missingFields.join(', ')}`
      });
    }

    const { email, password, name, address, ...restData } = req.cleanBody;

    // Validation email améliorée
    const emailError = validateEmail(email);
    if (emailError) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: emailError.message 
      });
    }

    // Validation du mot de passe
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Le mot de passe doit contenir au moins 8 caractères'
      });
    }

    // Vérification de l'existence de l'utilisateur dans une transaction
    const existingUser = await db.transaction(async (tx) => {
      return await tx.select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);
    });

    if (existingUser.length > 0) {
      return res.status(409).json({ 
        error: 'Un utilisateur avec cet email existe déjà' 
      });
    }

    // Hash sécurisé du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12); // Coût augmenté à 12

    // Création de l'utilisateur avec seulement les champs autorisés
    const [user] = await db.transaction(async (tx) => {
      return await tx.insert(usersTable)
        .values({
          email,
          password: hashedPassword,
          name,
          address,
          ...restData // Seuls les champs validés seront inclus
        })
        .returning({
          id: usersTable.id,
          email: usersTable.email,
          name: usersTable.name,
          address: usersTable.address,
          createdAt: usersTable.createdAt
        });
    });

    // Journalisation sécurisée
    console.log(`Nouvel utilisateur enregistré: ${user.id}`);

    // Génération du token JWT
    const token = generateUserToken({
      id: user.id,
      email: user.email
    });

    // Sécurité: Headers HTTP
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');

    // Réponse sans informations sensibles
    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        address: user.address,
        createdAt: user.createdAt
      },
      token,
      expiresIn: '24h' // Information utile pour le client
    });

  } catch (error) {
    console.error('Erreur d\'enregistrement:', error);
    
    // Ne pas exposer les détails de l'erreur en production
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Une erreur est survenue lors de l\'enregistrement';

    return res.status(500).json({
      error: 'Erreur serveur',
      message: errorMessage
    });
  }
});

router.post('/login', validateData(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.cleanBody;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (!user) {
      res.status(401).json({ error: 'email not found' });
      return;
    }
    if (!email || !password) {
      res.status(401).json({ error: 'email or password is required' });
      return;
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      res.status(401).json({ error: 'password incorrect' });
      return;
    }

    // create a jwt token
    const token = generateUserToken(user);
    // @ts-ignore
    delete user.password;
    res.status(200).json({ token, user });
  } catch (e) {
    res.status(500).send('Something went wrong');
  }
});

export default router;
