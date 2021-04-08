import ecdsa
from hashlib import sha256

# SECP256k1 is the Bitcoin elliptic curve
sk = ecdsa.SigningKey.generate(curve=ecdsa.SECP256k1, hashfunc=sha256) 
sk_str = sk.to_string().hex()
vk = sk.get_verifying_key()
vk_str = vk.to_string().hex()

sig = sk.sign(b"message")
sig2 = sk.sign(b"message")

print(sig)
print('sigs are same', sig == sig2)
print(vk.verify(sig, b"message")) # True

vk = ecdsa.VerifyingKey.from_string(bytes.fromhex(vk_str), curve=ecdsa.SECP256k1, hashfunc=sha256)
vk2 = ecdsa.VerifyingKey.from_string(bytes.fromhex(vk_str), curve=ecdsa.SECP256k1, hashfunc=sha256)
print('are they same', vk.to_string().hex() == vk2.to_string().hex())

print(vk.verify(bytes.fromhex(sig2.hex()), b'message')) # True

print(len(sig))
print(len(sk_str), len(vk_str))

# https://stackoverflow.com/questions/34451214/how-to-sign-and-verify-signature-with-ecdsa-in-python
