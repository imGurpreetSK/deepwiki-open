import adalflow as adal
import logging

from api.config import configs

logger = logging.getLogger(__name__)

def get_embedder() -> adal.Embedder:
    embedder_config = configs["embedder"]
    logger.info(f"HIT: Creating embedder with config: {embedder_config}")

    # --- Initialize Embedder ---
    model_client_class = embedder_config["model_client"]
    logger.info(f"HIT: Using model client class: {model_client_class.__name__}")
    
    if "initialize_kwargs" in embedder_config:
        model_client = model_client_class(**embedder_config["initialize_kwargs"])
    else:
        model_client = model_client_class()
    
    logger.info(f"HIT: Model kwargs: {embedder_config.get('model_kwargs', {})}")
    
    embedder = adal.Embedder(
        model_client=model_client,
        model_kwargs=embedder_config["model_kwargs"],
    )
    
    # Test the embedder
    try:
        test_result = embedder(input="test")
        logger.info(f"HIT: Embedder test successful, result type: {type(test_result)}")
        if hasattr(test_result, 'data') and test_result.data:
            logger.info(f"HIT: Embedder returned {len(test_result.data)} embeddings")
            if len(test_result.data) > 0 and hasattr(test_result.data[0], 'embedding'):
                logger.info(f"HIT: Embedding dimension: {len(test_result.data[0].embedding)}")
    except Exception as e:
        logger.error(f"HIT: Embedder test failed: {str(e)}")
        raise
    
    return embedder
