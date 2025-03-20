import AppDataSource from "../data-source";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { Product } from "../entities/Product";

export class CartService {
  private cartRepository = AppDataSource.getRepository(Cart);
  private cartItemRepository = AppDataSource.getRepository(CartItem);
  private productRepository = AppDataSource.getRepository(Product);

  async getCart(userId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ["items", "items.product"],
    });

    if (!cart) {
      const newCart = this.cartRepository.create({ userId, items: [] });
      return await this.cartRepository.save(newCart);
    }

    return cart;
  }

  async addToCart(userId: number, productId: number, quantity: number, size?: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    const product = await this.productRepository.findOne({ where: { id: productId } });

    if (!product) {
      throw new Error("Product not found");
    }

    let cartItem = cart.items.find((item) => item.product.id === productId && item.size === size);

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartItemRepository.create({ product, quantity, size });
      cart.items.push(cartItem);
    }

    return await this.cartRepository.save(cart);
  }

  async removeFromCart(userId: number, productId: number, size?: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter((item) => !(item.product.id === productId && item.size === size));
    return await this.cartRepository.save(cart);
  }

  async updateCartItem(userId: number, productId: number, quantity: number, size?: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    const cartItem = cart.items.find((item) => item.product.id === productId && item.size === size);

    if (cartItem) {
      cartItem.quantity = quantity;
      return await this.cartRepository.save(cart);
    }

    throw new Error("Cart item not found");
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.getCart(userId);
    cart.items = [];
    await this.cartRepository.save(cart);
  }
}