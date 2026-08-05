import logging
import asyncio
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# InMemory fallback store for live chat connections and presence if Redis is offline
class MemoryStore:
    def __init__(self):
        self._store: Dict[str, str] = {}
        self._pubsub_channels: Dict[str, list] = {}

    async def get(self, key: str) -> Optional[str]:
        return self._store.get(key)

    async def set(self, key: str, value: str, ex: Optional[int] = None) -> None:
        self._store[key] = value

    async def delete(self, key: str) -> None:
        self._store.pop(key, None)

    async def publish(self, channel: str, message: str) -> None:
        listeners = self._pubsub_channels.get(channel, [])
        for cb in listeners:
            if asyncio.iscoroutinefunction(cb):
                await cb(message)
            else:
                cb(message)

memory_store = MemoryStore()

async def get_redis_client():
    try:
        import redis.asyncio as aioredis
        from app.core.config import settings
        client = aioredis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, decode_responses=True)
        await client.ping()
        return client
    except Exception as e:
        logger.warning(f"Redis unavailable ({e}), using in-memory store fallback.")
        return memory_store
